import fs from "node:fs";

const read = (f) => JSON.parse(fs.readFileSync(`content/${f}.json`, "utf8"));

export default function () {
  const insights = fs
    .readdirSync("content/insights")
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ slug: f.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.json$/, ""), ...read(`insights/${f.slice(0, -5)}`) }))
    // Posts marked as drafts show in the local preview only. They are left out when the site is published.
    // Posts marked hidden are kept in the project but never shown on the site.
    .filter((x) => !x.hidden)
    .filter((x) => !(x.draft && process.env.GITHUB_ACTIONS))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (a.draft ? 1 : 0) - (b.draft ? 1 : 0) || (b.date || "").localeCompare(a.date || "") || (a.section === "news" ? -1 : 1) - (b.section === "news" ? -1 : 1))
    // Posts live in one of three sections; each section has its own list page and address.
    .map((x) => ({ ...x, section: x.section || "cases", route: { cases: "insights", opinions: "opinions", news: "news" }[x.section || "cases"] }));

  // One page per post per language. English pages exist only where an English title is filled in.
  const insightPages = insights.flatMap((item) =>
    ["lt", "en"].filter((lang) => item[lang] && item[lang].title).map((lang) => ({ lang, item }))
  );

  const sectionPages = ["en", "lt"].flatMap((lang) =>
    [["opinions", "opinions"], ["news", "news"]].map(([section, route]) => ({ lang, section, route }))
  );

  // The five steps of the journey. Every method, case and resource is tagged with one or more of them.
  const steps = read("steps").items.map((s, i) => ({ ...s, n: i + 1 }));
  return {
    insights,
    insightPages,
    sectionPages,
    steps,
    gallery: read("gallery"),
    collaborators: read("collaborators"),
    about: read("about"),
    services: read("services"),
    calls: read("calls"),
    work: read("work"),
    guidesExternal: read("guides_external"),
    projects: read("projects"),
    workshops: read("workshops"),
    collaborations: read("collaborations"),
    stats: read("stats"),
    team: read("team"),
  };
}
