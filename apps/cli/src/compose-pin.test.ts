import { describe, expect, it } from "vitest";
import { parseRenderedVersion, refreshHeaderVersion, repinImages } from "./compose-pin.js";

const LEGACY_COMPOSE = `name: sightline

services:
  web:
    image: sightline-app/sightline-web:latest
  worker:
    image: sightline-app/sightline-worker:latest
  db-migrate:
    image: sightline-app/sightline-db-migrate:latest
  postgres:
    image: postgres:16-alpine
`;

const HEADED_COMPOSE = `# Rendered by sightline 0.2.10 on 2026-01-01T00:00:00.000Z
# Run \`sightline upgrade\` after upgrading the CLI to refresh this file.
name: sightline

services:
  web:
    image: sightline-app/sightline-web:0.2.10
  postgres:
    image: postgres:16-alpine
`;

describe("parseRenderedVersion", () => {
	it("reads the version from a rendered-by header", () => {
		expect(parseRenderedVersion(HEADED_COMPOSE)).toBe("0.2.10");
	});

	it("returns null when there is no header", () => {
		expect(parseRenderedVersion(LEGACY_COMPOSE)).toBeNull();
	});
});

describe("repinImages", () => {
	it("re-pins every sightline-app/sightline-* image to the target version", () => {
		const out = repinImages(LEGACY_COMPOSE, "0.2.13");
		expect(out).toContain("sightline-app/sightline-web:0.2.13");
		expect(out).toContain("sightline-app/sightline-worker:0.2.13");
		expect(out).toContain("sightline-app/sightline-db-migrate:0.2.13");
		expect(out).not.toContain(":latest");
	});

	it("leaves third-party images untouched", () => {
		const out = repinImages(LEGACY_COMPOSE, "0.2.13");
		expect(out).toContain("postgres:16-alpine");
	});
});

describe("refreshHeaderVersion", () => {
	it("replaces an existing header in place without duplicating it", () => {
		const out = refreshHeaderVersion(HEADED_COMPOSE, "0.2.13");
		expect(parseRenderedVersion(out)).toBe("0.2.13");
		expect(out.match(/# Rendered by sightline /g)).toHaveLength(1);
	});

	it("adds a header to a legacy file that has none", () => {
		expect(parseRenderedVersion(LEGACY_COMPOSE)).toBeNull();
		const out = refreshHeaderVersion(LEGACY_COMPOSE, "0.2.13");
		expect(parseRenderedVersion(out)).toBe("0.2.13");
		expect(out).toContain("name: sightline");
	});
});

// Without a detectable header afterwards, the next upgrade would skip the re-pin.
describe("legacy install re-pin round-trip", () => {
	it("pins images and records the version", () => {
		const out = refreshHeaderVersion(repinImages(LEGACY_COMPOSE, "0.2.13"), "0.2.13");
		expect(out).not.toContain(":latest");
		expect(out).toContain("sightline-app/sightline-web:0.2.13");
		expect(out).toContain("postgres:16-alpine");
		expect(parseRenderedVersion(out)).toBe("0.2.13");
	});
});
