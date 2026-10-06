// Minimal GitHub API client for the workflow (uses the job's GITHUB_TOKEN).
const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPOSITORY; // owner/name

async function gh(method, path, body) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: { authorization: `Bearer ${TOKEN}`, accept: 'application/vnd.github+json', 'content-type': 'application/json', 'user-agent': 'she-persisted-episodes' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  return res.status === 204 ? null : res.json();
}

const QUOTES_LABEL = 'quotes';
const QUOTES_TITLE = 'pull quotes awaiting approval';

async function findQuotesIssue() {
  if (!TOKEN || !REPO) return null;
  const list = await gh('GET', `/repos/${REPO}/issues?labels=${QUOTES_LABEL}&state=open&per_page=5`);
  return list.find((i) => i.title === QUOTES_TITLE) || null;
}

module.exports = { gh, TOKEN, REPO, QUOTES_LABEL, QUOTES_TITLE, findQuotesIssue };
