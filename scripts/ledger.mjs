// Renders "the ledger": my most recent real commits across public repos, as an SVG for the
// profile README. Runs daily in CI next to the snake, so it never goes stale.
// Public data only (GitHub commit search). Docs-only and README commits are left out.
import { writeFileSync, mkdirSync } from "node:fs";

const USER = "fh1m";
const token = process.env.GITHUB_TOKEN;
const headers = { Accept: "application/vnd.github+json", "User-Agent": "fh1m-ledger", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
const res = await fetch(`https://api.github.com/search/commits?q=author:${USER}&sort=author-date&order=desc&per_page=100`, { headers });
if (!res.ok) throw new Error(`search failed: ${res.status}`);
const { items } = await res.json();

const skip = /^(readme|docs?\b|docs?\(|docs?:|chore|merge|wip|smol|cleanup|update readme|initial commit)/i;
const seen = new Set();
const rows = [];
for (const it of items) {
  const subject = it.commit.message.split("\n")[0].trim();
  if (skip.test(subject) || seen.has(subject)) continue;
  seen.add(subject);
  rows.push({ date: it.commit.author.date.slice(0, 10), repo: it.repository.name, subject });
  if (rows.length === 7) break;
}
// the real 30-day count, not capped by the page size
const since = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
const recent = await (await fetch(`https://api.github.com/search/commits?q=author:${USER}+author-date:>=${since}&per_page=100`, { headers })).json();
const days30 = recent.total_count ?? 0;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
function svg(theme) {
  const c = theme === "dark"
    ? { bg: "#0d1117", line: "#21262d", fg: "#e6edf3", dim: "#7d8590", acc: "#58a6ff", hash: "#d29922" }
    : { bg: "#ffffff", line: "#d0d7de", fg: "#1f2328", dim: "#656d76", acc: "#0969da", hash: "#9a6700" };
  const H = 70 + rows.length * 30 + 34;
  const lines = rows.map((r, i) => {
    const y = 70 + i * 30;
    return `<text x="24" y="${y}" fill="${c.dim}">${r.date}</text><text x="128" y="${y}" fill="${c.hash}">${esc(clip(r.repo, 18))}</text><text x="292" y="${y}" fill="${c.fg}">${esc(clip(r.subject, 64))}</text>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="860" height="${H}" viewBox="0 0 860 ${H}" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" font-size="13">
<rect width="860" height="${H}" rx="8" fill="${c.bg}" stroke="${c.line}"/>
<text x="24" y="34" fill="${c.acc}" font-size="14">$ git log --author=fh1m   # docs and README commits left out</text>
${lines}
<text x="24" y="${H - 16}" fill="${c.dim}">${days30} public commits in the last 30 days. Rebuilt every day from the GitHub API.</text>
</svg>`;
}
mkdirSync("dist", { recursive: true });
writeFileSync("dist/ledger-dark.svg", svg("dark"));
writeFileSync("dist/ledger-light.svg", svg("light"));
console.log(rows.length, "rows;", days30, "commits in 30 days");
