// A daily, inspectable account of changes and checks, not a score for competence.
// All data is public. A passing CI run is not evidence of successful field trials.
import { writeFileSync, mkdirSync } from "node:fs";

const USER = "fh1m";
const WINDOW_DAYS = 30;
const today = new Date();
const since = new Date(today.getTime() - WINDOW_DAYS * 86400000).toISOString().slice(0, 10);
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "fh1m-profile-evidence",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function github(path, params = {}) {
  const url = new URL(`https://api.github.com${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value));
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`GitHub ${response.status}: ${url.pathname} / ${await response.text()}`);
  return response.json();
}

const commitQuery = `author:${USER} author-date:>=${since}`;
const pullQuery = `is:pr is:merged author:${USER} merged:>=${since}`;
const [commitPage, pullPage] = await Promise.all([
  github("/search/commits", { q: commitQuery, per_page: 100, page: 1, sort: "author-date", order: "desc" }),
  github("/search/issues", { q: pullQuery, per_page: 100, page: 1, sort: "updated", order: "desc" }),
]);
const extraPages = Math.min(9, Math.ceil(Math.min(commitPage.total_count ?? 0, 1000) / 100) - 1);
const others = await Promise.all(Array.from({ length: Math.max(0, extraPages) }, (_, i) =>
  github("/search/commits", { q: commitQuery, per_page: 100, page: i + 2, sort: "author-date", order: "desc" })
));
const commits = [commitPage, ...others].flatMap(page => page.items ?? []);
// A profile-README update is not engineering work; keep it out of the engineering signals.
const codeCommits = commits.filter(item => item.repository?.full_name !== `${USER}/${USER}`);
const activeDays = new Set(codeCommits.map(item => (item.commit?.author?.date ?? "").slice(0, 10)).filter(Boolean)).size;
const activeRepos = new Set(codeCommits.map(item => item.repository?.full_name).filter(Boolean)).size;
const morePullPages = Math.max(0, Math.min(9, Math.ceil(Math.min(pullPage.total_count ?? 0, 1000) / 100) - 1));
const pullOthers = await Promise.all(Array.from({ length: morePullPages }, (_, i) =>
  github("/search/issues", { q: pullQuery, per_page: 100, page: i + 2, sort: "updated", order: "desc" })
));
const merged = [pullPage, ...pullOthers].flatMap(page => page.items ?? [])
  .filter(item => item.pull_request?.merged_at && item.repository_url !== `https://api.github.com/repos/${USER}/${USER}`)
  .sort((a, b) => b.pull_request.merged_at.localeCompare(a.pull_request.merged_at));
const totalMerged = merged.length;

// Source-level test files, NOT passing test cases. Filesystem discovery is intentionally conservative.
function isTestSource(path) {
  if (path.split("/").some(part => part.startsWith(".") || ["node_modules", "vendor", "third_party", "docs"].includes(part))) return false;
  const ext = /\.(?:py|c|cc|cpp|cxx|go|rs|sh|js|jsx|ts|tsx)$/i;
  return ext.test(path) && (
    /(?:^|\/)(?:tests?|__tests__)\/[^/]+/i.test(path) ||
    /(?:^|\/)(?:test_[^/]+|[^/]+_test|[^/]+\.(?:test|spec))\.(?:py|c|cc|cpp|cxx|go|rs|sh|js|jsx|ts|tsx)$/i.test(path)
  );
}
const pinned = [
  { name: "fh1m/mongla_ws", label: "mongla_ws", featuredTest: "src/mongla_control/test/test_actuation_model.py", workflows: ["ros.yml", "repository-integrity.yml"] },
  { name: "fh1m/Dristy", label: "Dristy", featuredTest: "dristy/dristy-py/tests/test_protocol_wire.py", workflows: [] },
];
async function inspectRepo(project) {
  const root = `/repos/${project.name}`;
  const repo = await github(root);
  const tree = await github(`${root}/git/trees/${encodeURIComponent(repo.default_branch)}`, { recursive: 1 });
  const testFiles = tree.truncated ? null : (tree.tree ?? []).filter(item => item.type === "blob" && isTestSource(item.path));
  const checks = await Promise.all(project.workflows.map(async (workflow) => {
    try {
      const report = await github(`${root}/actions/workflows/${workflow}/runs`, { branch: repo.default_branch, event: "push", per_page: 8 });
      const run = (report.workflow_runs ?? []).find(r => r.event === "push" && r.status === "completed");
      return run ? { workflow, status: run.conclusion ?? "unknown", date: run.updated_at?.slice(0, 10) ?? "unknown", url: run.html_url ?? null } : null;
    } catch (error) {
      console.warn(`Could not read ${project.name} / ${workflow}: ${error.message}`);
      return null;
    }
  }));
  return {
    ...project,
    branch: repo.default_branch,
    pushed: repo.pushed_at?.slice(0, 10) ?? "unknown",
    tests: testFiles?.length ?? null,
    firstTest: testFiles?.find(item => item.path === project.featuredTest)?.path ?? testFiles?.[0]?.path ?? null,
    checks: checks.filter(Boolean),
  };
}
const repos = await Promise.all(pinned.map(inspectRepo));

const escapeXml = (s) => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const clip = (s, max) => String(s ?? "").length > max ? String(s).slice(0, max - 1) + "…" : String(s ?? "");
const colors = {
  dark: { bg: "#0d1117", border: "#30363d", rule: "#21262d", fg: "#e6edf3", quiet: "#8b949e", blue: "#79c0ff", amber: "#e3b341", good: "#7ee787", bad: "#ff7b72" },
  light: { bg: "#ffffff", border: "#d0d7de", rule: "#d8dee4", fg: "#1f2328", quiet: "#656d76", blue: "#0969da", amber: "#9a6700", good: "#1a7f37", bad: "#cf222e" },
};
function build(theme) {
  // One restrained frame: the overall body of work, and just enough verification
  // to earn a closer look. The full source-linked index remains one click away.
  const c = colors[theme];
  const W = 860, H = 244;
  const text = (x, y, value, fill = c.quiet, size = 12, weight = 400) =>
    `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="${weight}">${escapeXml(value)}</text>`;
  const stroke = (y) =>
    `<path d="M24 ${y}H836" stroke="${c.rule}" stroke-width="1" />`;
  const checks = (repo) => {
    const ros = repo.checks.find(x => x.workflow === "ros.yml");
    const integrity = repo.checks.find(x => x.workflow === "repository-integrity.yml");
    const states = [];
    if (ros) states.push(`ROS / Humble + Jazzy: ${ros.status === "success" ? "pass" : ros.status}`);
    if (integrity) states.push(`integrity: ${integrity.status === "success" ? "pass" : integrity.status}`);
    return states.join(" · ");
  };
  const elements = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Public engineering changes and test sources; select to inspect the evidence" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace">`,
    `<rect x="0.5" y="0.5" width="859" height="243" rx="7" fill="${c.bg}" stroke="${c.border}" />`,
    text(24, 34, "WORK / LAST 30 DAYS", c.quiet, 11),
    text(670, 34, `updated ${today.toISOString().slice(0, 10)}`, c.quiet, 11),
    text(24, 100, totalMerged.toLocaleString("en-US"), c.fg, 34),
    text(112, 96, "merged changes", c.quiet, 13),
    text(445, 100, activeRepos.toLocaleString("en-US"), c.fg, 34),
    text(515, 96, "codebases touched", c.quiet, 13),
    stroke(124),
  ];
  for (const [i, repo] of repos.entries()) {
    const y = 159 + i * 38;
    elements.push(text(24, y, repo.label, c.blue, 13, 600));
    elements.push(text(195, y, repo.tests === null ? "test sources unavailable" : `${repo.tests} test-source files`, c.fg, 12));
    const status = checks(repo);
    if (status) elements.push(text(439, y, clip(status, 56), c.quiet, 11));
  }
  elements.push(stroke(215));
  elements.push(text(24, 233, "Source files, not passing test cases.  ·  Click to inspect the records.", c.quiet, 10));
  elements.push("</svg>");
  return elements.join("\n");
}
// The long-form index lives on the generated output branch; main never needs daily bot commits.
const mdSafe = (s) => String(s ?? "").replace(/([\\[\]])/g, "\\$1");
const report = [
  "# The public trail",
  "",
  "Code, test sources and check runs. All links lead back to GitHub. These are records of work, not evidence of performance in the water.",
  "",
  `Updated ${today.toISOString().slice(0, 10)} (UTC) · rolling ${WINDOW_DAYS}-day window`,
  "",
  "## The window",
  "",
  `- ${commitPage.total_count ?? commits.length} public commits (including profile maintenance)`,
  `- ${activeRepos} non-profile repositories with authored commits`,
  `- ${activeDays} ${activeDays === 1 ? "date" : "dates"} with authored commits`,
  `- ${totalMerged} merged pull ${totalMerged === 1 ? "request" : "requests"} authored by ${USER}`,
  "",
  "## Recently merged",
  "",
];
if (!merged.length) report.push("No merged public pull requests were found in the window.");
for (const item of merged.slice(0, 8)) {
  const date = item.pull_request.merged_at.slice(0, 10);
  const hasMethod = /^##\s+(?:Verified|Testing|Tests|Validation|How (?:I )?tested|Test plan)\b/im.test(item.body ?? "");
  report.push(`- [${mdSafe(item.title)}](${item.html_url}) — ${date}${hasMethod ? " · method/verification notes in PR body" : ""}`);
}
report.push("", "## Test sources and checks", "");
for (const r of repos) {
  const root = `https://github.com/${r.name}`;
  const source = r.firstTest ? `${root}/blob/${r.branch}/${r.firstTest.split("/").map(encodeURIComponent).join("/")}` : `${root}/tree/${r.branch}`;
  report.push(`### [${r.label}](${root})`, "");
  report.push(`- ${r.tests === null ? "Source tree truncated: file count unavailable" : `${r.tests} test-source ${r.tests === 1 ? "file" : "files"} detected on ${r.branch}`} — [inspect an example](${source})`);
  report.push(`- Latest repository push: ${r.pushed}`);
  if (r.checks.length) {
    for (const run of r.checks) report.push(`- ${run.workflow}: **${run.status}** (${run.date})${run.url ? ` — [run log](${run.url})` : ""}`);
  } else {
    report.push("- No CI result displayed for this repository; this is not a test result.");
  }
  report.push("");
}
report.push(
  "## Method",
  "",
  "Commits: GitHub's public commit search for the author's date window. PRs: GitHub's merged PR search (self-merges count; this is not a claim of peer review). Test-source files: a conservative path/name filter over the default-branch Git tree, including test harnesses; these are files, not passing test cases. CI: the latest completed default-branch push runs from named workflows; success is not a hardware validation claim.",
  ""
);
mkdirSync("dist", { recursive: true });
writeFileSync("dist/evidence.md", report.join("\n"));
mkdirSync("dist", { recursive: true });
for (const theme of ["dark", "light"]) writeFileSync(`dist/evidence-${theme}.svg`, build(theme));
console.log(`Evidence: ${totalMerged} merged PRs, ${activeRepos} repos, ${activeDays} active days; test files: ${repos.map(r => r.tests).join(", ")}`);
