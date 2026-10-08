import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function (cfg) {
  cfg.addPlugin(EleventyHtmlBasePlugin);
  // Images uploaded through Pages CMS.
  cfg.addPassthroughCopy({ assets: "assets" });
  // Stylesheets, site images and anything else that is copied to the site as it is.
  cfg.addPassthroughCopy({ static: "/" });
  cfg.addWatchTarget("./content/");

  // Items tagged with a given step of the journey.
  cfg.addFilter("forStep", (arr, key) => (arr || []).filter((x) => (x.steps || []).includes(key)));
  cfg.addFilter("inSection", (arr, section) => (arr || []).filter((x) => x.section === section));
  cfg.addFilter("published", (arr) => (arr || []).filter((x) => !x.draft));
  // Entries that are completely filled in (no [GAP: ...] left anywhere in them).
  cfg.addFilter("filled", (arr) => (arr || []).filter((x) => !JSON.stringify(x).includes("[GAP")));
  cfg.addFilter("filledParas", (s) => String(s || "").split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && !p.includes("[GAP")));
  cfg.addFilter("hasGap", (v) => JSON.stringify(v || "").includes("[GAP"));
  // Case notes that are not already shown as one of our own projects.
  cfg.addFilter("notOwn", (arr) => (arr || []).filter((x) => !x.own));
  // Funding calls whose deadline has not passed yet, and those without a date so far.
  cfg.addFilter("dated", (arr) => (arr || []).filter((x) => x.deadline && x.deadline >= new Date().toISOString().slice(0, 10)));
  cfg.addFilter("undated", (arr) => (arr || []).filter((x) => !x.deadline));
  // Front page list: the two newest posts of each section, then newest first.
  cfg.addFilter("mixed", (arr) => {
    const seen = {};
    return (arr || [])
      .slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .filter((x) => (seen[x.section] = (seen[x.section] || 0) + 1) <= 2);
  });
  cfg.addFilter("take", (arr, n) => (arr || []).slice(0, n));
  cfg.addFilter("inLang", (arr, lang) => (arr || []).filter((x) => x[lang] && x[lang].title));
  cfg.addFilter("niceDate", (d, lang) =>
    d ? new Intl.DateTimeFormat(lang === "lt" ? "lt-LT" : "en-GB", { dateStyle: "long" }).format(new Date(d)) : ""
  );
  // Plain text with blank lines between paragraphs becomes paragraphs.
  cfg.addFilter("paras", (s) =>
    String(s || "").split(/\n\s*\n/).filter((p) => p.trim()).map((p) => `<p>${esc(p.trim())}</p>`).join("\n          ")
  );
  // Text that is still missing is written as [GAP: ...] in the content files. It is left out of the pages,
  // together with a paragraph or list item that held nothing else.
  cfg.addFilter("mark", (s) =>
    String(s || "").replace(/\s*\[GAP:[^\]]*\]/g, "").replace(/<(p|li)>\s*<\/\1>/g, "")
  );

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    pathPrefix: process.env.PATH_PREFIX || "/",
    htmlTemplateEngine: "njk",
  };
}
