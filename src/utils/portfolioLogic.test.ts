import test from "node:test";
import assert from "node:assert/strict";
import { config } from "../config";
import {
  resolveExperienceMode,
  resolveInitialTheme,
  getNextTheme,
  clampDevicePixelRatio,
  filterProjects,
  formatChessMovePairs,
  calculateMaterialAdvantage,
  validateContactForm,
} from "./portfolioLogic";

test("resolveExperienceMode selects desktop only for fine pointer and width >= 1024", () => {
  assert.equal(resolveExperienceMode({ width: 1440, hasFinePointer: true }), "desktop");
  assert.equal(resolveExperienceMode({ width: 1024, hasFinePointer: true }), "desktop");
  // Tablet with coarse pointer uses mobile experience
  assert.equal(resolveExperienceMode({ width: 1180, hasFinePointer: false }), "mobile");
  // Narrow viewport with fine pointer uses mobile experience
  assert.equal(resolveExperienceMode({ width: 768, hasFinePointer: true }), "mobile");
  assert.equal(resolveExperienceMode({ width: 390, hasFinePointer: false }), "mobile");
});

test("resolveInitialTheme respects saved preference and falls back to system or light default", () => {
  assert.equal(resolveInitialTheme("dark", false), "dark");
  assert.equal(resolveInitialTheme("light", true), "light");
  assert.equal(resolveInitialTheme(null, true), "dark");
  assert.equal(resolveInitialTheme(null, false), "light");
  assert.equal(getNextTheme("light"), "dark");
  assert.equal(getNextTheme("dark"), "light");
});

test("clampDevicePixelRatio enforces desktop <= 2, mobile <= 1.5, and softwareGl = 1", () => {
  assert.equal(clampDevicePixelRatio({ rawDpr: 3, mode: "desktop" }), 2);
  assert.equal(clampDevicePixelRatio({ rawDpr: 3, mode: "mobile" }), 1.5);
  assert.equal(clampDevicePixelRatio({ rawDpr: 2.5, mode: "desktop", isSoftwareGl: true }), 1);
  assert.equal(clampDevicePixelRatio({ rawDpr: 1.25, mode: "mobile" }), 1.25);
});

test("filterProjects preserves all 4 featured projects and filters by domain and query", () => {
  const featured = filterProjects(config.projects, "featured");
  assert.equal(featured.length, 4);
  const titles = featured.map((p) => p.title);
  assert.ok(titles.includes("ADAM-1 Enhanced"));
  assert.ok(titles.includes("Simha AI"));
  assert.ok(titles.includes("ResumePilot"));
  assert.ok(titles.some((t) => t.includes("Smart Loan")));

  const aiOnly = filterProjects(config.projects, "ai");
  assert.ok(aiOnly.length >= 3);
  assert.ok(aiOnly.every((p) => p.domain === "ai"));

  const searchPgvector = filterProjects(config.projects, "all", "pgvector");
  assert.equal(searchPgvector.length, 1);
  assert.equal(searchPgvector[0].title, "ADAM-1 Enhanced");
});

test("formatChessMovePairs and calculateMaterialAdvantage compute accurate chess state", () => {
  const pairs = formatChessMovePairs([
    { from: "e2", to: "e4", piece: "p", san: "e4" },
    { from: "e7", to: "e5", piece: "p", san: "e5" },
    { from: "g1", to: "f3", piece: "n", san: "Nf3" },
  ]);
  assert.equal(pairs.length, 2);
  assert.deepEqual(pairs[0], { moveNum: 1, white: "e4", black: "e5" });
  assert.deepEqual(pairs[1], { moveNum: 2, white: "Nf3", black: "" });

  const mat = calculateMaterialAdvantage(["p", "p", "q"], ["n", "b"]);
  assert.equal(mat.whiteScore, 11);
  assert.equal(mat.blackScore, 6);
  assert.equal(mat.netWhite, 5);
});

test("validateContactForm rejects empty or invalid inputs and accepts valid submissions", () => {
  assert.equal(validateContactForm({ name: "", email: "a@b.com", message: "Hello world" }).valid, false);
  assert.equal(validateContactForm({ name: "Narasimha", email: "invalid", message: "Hello world" }).valid, false);
  assert.equal(validateContactForm({ name: "Narasimha", email: "a@b.com", message: "Short" }).valid, false);
  assert.equal(
    validateContactForm({
      name: "Narasimha",
      email: "user@example.com",
      message: "Interested in collaborating on a RAG system.",
    }).valid,
    true
  );
});
