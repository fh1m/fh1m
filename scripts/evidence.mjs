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

// Public history, not a rolling activity score. GitHub repo search includes archive work.
const page1 = await github("/search/repositories", { q: `user:${USER} fork:false`, sort: "created", order: "asc", page: 1, per_page: 100 });
const repoPages = Math.min(10, Math.ceil((page1.total_count ?? 0) / 100));
const pages = await Promise.all(Array.from({length: Math.max(0,repoPages-1)}, (_,i) =>
  github("/search/repositories", {q: `user:${USER} fork:false`, sort: "created", order: "asc", page: i+2, per_page: 100})));
const originals = [page1,...pages].flatMap(p=>p.items??[])
  .filter(r => !r.fork && r.owner?.login?.toLowerCase() === USER && r.name !== USER)
  .sort((a,b)=>(a.created_at??"").localeCompare(b.created_at??""));
const firstYear = originals[0]?.created_at?.slice(0,4) ?? "—";
async function inspectSourceTree(repo) {
  try {
    const tree = await github(`/repos/${USER}/${encodeURIComponent(repo.name)}/git/trees/${encodeURIComponent(repo.default_branch)}`, {recursive: 1});
    if (tree.truncated) return {repo, tests: null, workflows: null};
    const paths = (tree.tree??[]).filter(f=>f.type==="blob").map(f=>f.path);
    return {repo, tests: paths.filter(isTestSource).length,
      workflows: paths.filter(p=>/^\.github\/workflows\/[^/]+\.ya?ml$/i.test(p)).length};
  } catch(error) {
    console.warn(`Cannot inspect tree of ${repo.name}: ${error.message}`);
    return {repo, tests: null, workflows: null};
  }
}
const inventory=[];
for(let i=0;i<originals.length;i+=5) inventory.push(...await Promise.all(originals.slice(i,i+5).map(inspectSourceTree)));
const unknownTrees=inventory.filter(r=>r.tests===null).length;
const testRepoCount=inventory.filter(r=>(r.tests??0)>0).length;
const workflowRepoCount=inventory.filter(r=>(r.workflows??0)>0).length;
const count=n=>`${n}${unknownTrees?"+":""}`;
const threads=[
  {label:"WATER",title:"mongla_ws",repos:["mongla_ws"],
    summary:"Underwater autonomy, localization, control and ROS 2"},
  {label:"PERCEPTION",title:"Dristy",repos:["Dristy"],
    summary:"K210 camera firmware and host-side vision tools"},
  {label:"GROUND",title:"rupsha_ws",repos:["rupsha_ws"],
    summary:"Ackermann rover autonomy, still taking shape"},
  {label:"EXPERIMENTS",title:"pareidolia / half-a-second",repos:["pareidolia","half-a-second"],
    summary:"What detectors see; what a tracker can predict"},
  {label:"SYSTEMS",title:".dotfiles / secure-terminal",repos:[".dotfiles","secure-terminal-p2p-chat"],
    summary:"Linux environments and secure terminal protocols"}
];


const escapeXml = (s) => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const clip = (s, max) => String(s ?? "").length > max ? String(s).slice(0, max - 1) + "…" : String(s ?? "");
const colors = {
  dark: { bg: "#0d1117", border: "#30363d", rule: "#21262d", fg: "#e6edf3", quiet: "#8b949e", blue: "#79c0ff", amber: "#e3b341", good: "#7ee787", bad: "#ff7b72" },
  light: { bg: "#ffffff", border: "#d0d7de", rule: "#d8dee4", fg: "#1f2328", quiet: "#656d76", blue: "#0969da", amber: "#9a6700", good: "#1a7f37", bad: "#cf222e" },
};
function build(theme) {
  const c=colors[theme], W=860, H=506;
  const t=(x,y,value,fill=c.quiet,size=12,weight=400)=>
    `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="${weight}">${escapeXml(value)}</text>`;
  const line=y=>`<path d="M26 ${y} H834" stroke="${c.rule}" stroke-width="1"/>`;
  const parts=[
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Engineering record: public projects, test-bearing projects, automated workflows and five engineering disciplines" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace">`,
    `<rect x=".5" y=".5" width="859" height="505" rx="7" fill="${c.bg}" stroke="${c.border}"/>`,
    t(26,31,"A PUBLIC RECORD",c.blue,13,600),
    t(664,31,`${firstYear} — ${today.getUTCFullYear()}`),
    t(26,60,"The systems, experiments, and tools behind the commit graph."),
    t(26,108,String(originals.length),c.fg,30),
    t(101,106,"original repos"),
    t(305,108,count(testRepoCount),c.fg,30),
    t(380,106,"with test sources"),
    t(604,108,count(workflowRepoCount),c.fg,30),
    t(680,106,"with workflows"),
    line(129)
  ];
  for(const [i,thread] of threads.entries()){
    const y=168+i*61;
    parts.push(t(26,y,thread.label,c.quiet,11,600));
    parts.push(t(185,y,thread.title,c.blue,14,600));
    parts.push(t(185,y+21,thread.summary,c.fg,12));
    if(i!==threads.length-1)parts.push(line(y+39));
  }
  parts.push(line(475));
  parts.push(t(26,495,"Public source, not a claim of field performance.  ·  Open the full repository atlas.",c.quiet,10));
  parts.push("</svg>");
  return parts.join("\n");
}
// The long-form index lives on the generated output branch; main never needs daily bot commits.
const mdSafe = (s) => String(s ?? "").replace(/([\\[\]])/g, "\\$1");
const report = [
  "# The public trail",
  "",
  "Code, test sources and check runs. All links lead back to GitHub. These are records of work, not evidence of performance in the water.",
  "",
  `Updated ${today.toISOString().slice(0, 10)} (UTC) · lifetime source inventory and recent receipts`,
  "",
  "## Recent activity (30 days)",
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
const accountReport=[
  "## Across the whole account",
  "",
  `Public original repositories, ${firstYear}–${today.getUTCFullYear()}; archived history included, forks and the profile repository excluded.`,
  "",
  `- **${originals.length}** original public repositories`,
  `- **${count(testRepoCount)}** repositories containing test sources`,
  `- **${count(workflowRepoCount)}** repositories containing GitHub Actions workflows`,
  `- **${unknownTrees}** truncated or unavailable source trees (if nonzero, the figures above are lower bounds)`,
  "",
  "## Engineering threads",
  ""
];
for(const th of threads)accountReport.push(`- **${th.label}** — ${th.repos.map(n=>`[${n}](https://github.com/${USER}/${n})`).join(" · ")}: ${th.summary}`);
accountReport.push(
  "",
  "## Complete repository atlas",
  "",
  "| Repository | Created | Last push | Primary language | Test sources | Workflows |",
  "|---|---|---|---|---:|---:|"
);
for(const item of inventory){
  const r=item.repo, archived=r.archived?" *(archived)*":"";
  accountReport.push(`| [${r.name}](${r.html_url})${archived} | ${(r.created_at??"—").slice(0,10)} | ${(r.pushed_at??"—").slice(0,10)} | ${(r.language??"—").replace(/\|/g,"/")} | ${item.tests??"unknown"} | ${item.workflows??"unknown"} |`);
}
accountReport.push("");
report.splice(report.indexOf("## The window"),0,...accountReport);

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
  "Account atlas: GitHub public original-repository search, archived included, profile and forks omitted. Test files are heuristic source-path matches, not passing tests. Workflow counts mean YAML definitions, not CI successes. Unknown/truncated trees are shown explicitly. Recent receipts: rolling 30-day commit search and merged PRs (including self-merges, not necessarily peer reviewed). Named checks show default-branch push runs, not hardware validation.",
  ""
);
mkdirSync("dist", { recursive: true });
writeFileSync("dist/evidence.md", report.join("\n"));
mkdirSync("dist", { recursive: true });
for (const theme of ["dark", "light"]) writeFileSync(`dist/evidence-${theme}.svg`, build(theme));
console.log(`Evidence: ${totalMerged} merged PRs, ${activeRepos} repos, ${activeDays} active days; test files: ${repos.map(r => r.tests).join(", ")}`);
