import { describe, expect, it } from "vitest";
import { deploymentOpenApiSpec } from "../openapi";

const BRAND = { name: "Sightline", url: "https://app.sightline.example" };
const AGENCY = { name: "Acme Visibility", url: "https://visibility.acme.com" };

describe("deploymentOpenApiSpec", () => {
	it("answers with the host the spec was fetched from", () => {
		const spec = deploymentOpenApiSpec(BRAND, "https://app.sightline.example");

		expect(spec.servers).toEqual([{ url: "https://app.sightline.example/api/v1", description: "Sightline API" }]);
	});

	it("does not leak the vendor into a whitelabel deployment", () => {
		const spec = deploymentOpenApiSpec(AGENCY, "https://visibility.acme.com");

		expect(spec.info.title).toBe("Acme Visibility API");
		expect(spec.info.contact).toEqual({ name: "Acme Visibility", url: "https://visibility.acme.com" });
		expect(spec.servers?.[0]).toEqual({
			url: "https://visibility.acme.com/api/v1",
			description: "Acme Visibility API",
		});
	});

	it("serves a self-hosted instance its own address, port and all", () => {
		const spec = deploymentOpenApiSpec({ name: "Sightline", url: "http://localhost:3000" }, "http://localhost:3000");

		expect(spec.servers?.[0].url).toBe("http://localhost:3000/api/v1");
	});

	// The operator's canonical URL is a separate question from where this
	// request landed, and a stale one must not send callers somewhere they
	// cannot reach.
	it("takes the server from the request even when the configured URL differs", () => {
		const spec = deploymentOpenApiSpec(BRAND, "https://staging.sightline.example");

		expect(spec.servers?.[0].url).toBe("https://staging.sightline.example/api/v1");
		expect(spec.info.contact).toEqual(BRAND);
	});

	it("leaves the operations alone", () => {
		const spec = deploymentOpenApiSpec(BRAND, "https://app.sightline.example");

		expect(Object.keys(spec.paths as object)).toContain("/brands");
	});
});
