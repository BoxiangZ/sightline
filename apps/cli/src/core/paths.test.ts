import { describe, expect, it } from "vitest";
import { isWithin } from "./paths.js";

describe("isWithin", () => {
	it("treats a directory as inside itself, with or without a trailing slash", () => {
		expect(isWithin("/srv/sightline", "/srv/sightline")).toBe(true);
		expect(isWithin("/srv/sightline", "/srv/sightline/")).toBe(true);
		expect(isWithin("/srv/sightline/", "/srv/sightline")).toBe(true);
	});

	it("accepts anything below the directory, however deep", () => {
		expect(isWithin("/srv/sightline", "/srv/sightline/reports")).toBe(true);
		expect(isWithin("/srv/sightline", "/srv/sightline/reports/2026/audit.html")).toBe(true);
	});

	it("treats everything as inside the filesystem root", () => {
		expect(isWithin("/", "/srv")).toBe(true);
	});

	it("rejects parents and unrelated paths", () => {
		expect(isWithin("/srv/sightline", "/srv")).toBe(false);
		expect(isWithin("/srv/sightline", "/")).toBe(false);
		expect(isWithin("/srv/sightline", "/srv/other")).toBe(false);
	});

	it("rejects a sibling that shares the parent's name as a prefix", () => {
		expect(isWithin("/srv/sightline", "/srv/sightline-backup")).toBe(false);
		expect(isWithin("/srv/sightline", "/srv/sightline2/file")).toBe(false);
	});

	it("resolves dot-dot segments before deciding", () => {
		expect(isWithin("/srv/sightline", "/srv/sightline/reports/../config.json")).toBe(true);
		expect(isWithin("/srv/sightline", "/srv/sightline/../other")).toBe(false);
		expect(isWithin("/srv/sightline", "/srv/sightline/reports/../../etc/passwd")).toBe(false);
	});
});
