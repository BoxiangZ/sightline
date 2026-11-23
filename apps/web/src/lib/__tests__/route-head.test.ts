import { describe, expect, it } from "vitest";
import { buildTitle, getAppName, pageHead } from "@/lib/route-head";
import { BRAND_ROUTE_ID, ORG_ROUTE_ID } from "@/lib/route-subject";

const orgMatch = (name: string) => ({
	routeId: ORG_ROUTE_ID,
	loaderData: { organization: { name } },
});

const brandMatch = (name: string) => ({
	routeId: BRAND_ROUTE_ID,
	loaderData: { brand: { name } },
});

const branded = (name: string) => ({
	context: { clientConfig: { branding: { name } } },
});

describe("getAppName", () => {
	it('returns "Sightline" when the match has no context', () => {
		expect(getAppName({})).toBe("Sightline");
	});

	it("returns the branding name when set", () => {
		expect(getAppName(branded("Acme Insights"))).toBe("Acme Insights");
	});

	it('returns "Sightline" when the branding name is an empty string', () => {
		expect(getAppName(branded(""))).toBe("Sightline");
	});
});

describe("buildTitle", () => {
	it("joins page and app with a middle dot when there is no subject", () => {
		expect(buildTitle("Prompts", { appName: "Sightline" })).toBe("Prompts · Sightline");
	});

	it("includes the subject with a pipe when provided", () => {
		expect(buildTitle("Prompts", { appName: "Sightline", subject: "Acme" })).toBe("Prompts | Acme · Sightline");
	});
});

describe("pageHead", () => {
	it("names the brand rather than the organization inside a brand", () => {
		expect(pageHead({ title: "Sentiment" })({ match: {}, matches: [orgMatch("Globex"), brandMatch("Acme")] })).toEqual({
			meta: [{ title: "Sentiment | Acme · Sightline" }],
		});
	});

	it("uses the organization when there is no brand route", () => {
		expect(pageHead({ title: "Settings" })({ match: {}, matches: [orgMatch("Globex")] })).toEqual({
			meta: [{ title: "Settings | Globex · Sightline" }],
		});
	});

	it("has no subject outside an organization", () => {
		expect(pageHead({ title: "Admin" })({ match: {}, matches: [] })).toEqual({
			meta: [{ title: "Admin · Sightline" }],
		});
	});

	it("uses the breadcrumb when no title is given", () => {
		expect(pageHead({})({ match: { staticData: { crumb: "Prompts" } }, matches: [] })).toEqual({
			meta: [{ title: "Prompts · Sightline" }],
		});
	});

	it("prefers the explicit title over the breadcrumb", () => {
		expect(pageHead({ title: "A" })({ match: { staticData: { crumb: "B" } }, matches: [] })).toEqual({
			meta: [{ title: "A · Sightline" }],
		});
	});

	it("uses just the app name when there is neither a title nor a breadcrumb", () => {
		expect(pageHead({})({ match: {}, matches: [] })).toEqual({
			meta: [{ title: "Sightline" }],
		});
	});

	it("uses the branding name in the title", () => {
		expect(pageHead({ title: "Prompts" })({ match: branded("Acme Insights"), matches: [] })).toEqual({
			meta: [{ title: "Prompts · Acme Insights" }],
		});
	});

	it("adds a description meta tag only when one is given", () => {
		expect(pageHead({ title: "A", description: "D" })({ match: {}, matches: [] })).toEqual({
			meta: [{ title: "A · Sightline" }, { name: "description", content: "D" }],
		});
		expect(pageHead({ title: "A" })({ match: {}, matches: [] })).toEqual({
			meta: [{ title: "A · Sightline" }],
		});
	});
});
