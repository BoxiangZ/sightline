/**
 * Local development only: signs in a seeded dev admin so the dashboard can be
 * opened without the sign-up form. Gated twice — the deployment must be local
 * and DEV_AUTO_LOGIN must be "1" — and returns 404 otherwise. Never enable
 * this on a shared or deployed instance.
 */

import { createFileRoute } from "@tanstack/react-router";
import { countUsers } from "@workspace/lib/db/provisioning";
import { auth } from "@/lib/auth/server";

const DEV_EMAIL = "dev@sightline.local";
const DEV_PASSWORD = "sightline-dev";
const DEV_NAME = "Dev Admin";

function enabled(): boolean {
	return process.env.DEPLOYMENT_MODE === "local" && process.env.DEV_AUTO_LOGIN === "1";
}

function redirectedTo(response: Response): Response {
	const cookies = response.headers.getSetCookie?.() ?? [];
	const headers = new Headers({ location: "/app" });
	for (const cookie of cookies) headers.append("set-cookie", cookie);
	return new Response(null, { status: 302, headers });
}

export const Route = createFileRoute("/auth/dev-login")({
	server: {
		handlers: {
			GET: async () => {
				if (!enabled()) return new Response("Not available", { status: 404 });

				if ((await countUsers()) === 0) {
					const created = await auth.api.signUpEmail({
						body: { email: DEV_EMAIL, password: DEV_PASSWORD, name: DEV_NAME },
						asResponse: true,
					});
					if (!created.ok) return new Response(`Dev sign-up failed: ${await created.text()}`, { status: 500 });
					return redirectedTo(created);
				}

				const signedIn = await auth.api.signInEmail({
					body: { email: DEV_EMAIL, password: DEV_PASSWORD },
					asResponse: true,
				});
				if (!signedIn.ok) {
					return new Response(
						"Dev auto-login needs the seeded dev account. Reset the database, or sign in with the account this instance was bootstrapped with.",
						{ status: 409 },
					);
				}
				return redirectedTo(signedIn);
			},
		},
	},
	component: () => null,
});
