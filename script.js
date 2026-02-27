const username = "YOURUSERNAME"; // <-- change this
const repoGrid = document.getElementById("repoGrid");
const repoError = document.getElementById("repoError");

document.getElementById("year").textContent = new Date().getFullYear();

function fmtDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return iso;
  }
}

async function loadRepos() {
  try {
    const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("GitHub API request failed");

    const repos = await res.json();

    const filtered = repos
      .filter(r => !r.fork)
      .filter(r => r.name.toLowerCase() !== username.toLowerCase() + ".github.io")
      .slice(0, 9);

    if (!filtered.length) {
      repoError.textContent = "No repositories found to display.";
      return;
    }

    repoGrid.innerHTML = filtered.map(r => `
      <div class="repo">
        <a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a>
        <p>${r.description ? r.description : "No description yet. Add one in GitHub to make this look better."}</p>
        <div class="meta">
          <span>⭐ ${r.stargazers_count}</span>
          <span>🍴 ${r.forks_count}</span>
          <span>Updated: ${fmtDate(r.updated_at)}</span>
        </div>
      </div>
    `).join("");

  } catch (err) {
    repoError.textContent = "Could not load GitHub repos right now. Please try again later.";
  }
}

loadRepos();