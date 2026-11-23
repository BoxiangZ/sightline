/**
 * The pitch shown beside the sign-in and sign-up forms.
 *
 * Sign-in is the highest-intent page a deployment has, so it carries the
 * argument for the product rather than just a card on an empty background:
 * what it tracks, and which engines it reaches. Whitelabel tenants never see
 * it — they are not ours to sell to.
 */

import { IconCheck } from "@tabler/icons-react";
import { DEFAULT_APP_NAME, PROJECT_DOCS_URL, PROJECT_GITHUB_URL } from "@workspace/config/constants";
import { platformTierMembers } from "@workspace/config/plans";
import { ModelIcon } from "@workspace/ui/brand/model-icon";
import type { ReactNode } from "react";

/** Every engine the product can reach, named — the coverage claim is the product. */
const ENGINES = [...platformTierMembers("scraped"), ...platformTierMembers("api")];

const PITCH = {
	headline: "See how AI answers describe your brand.",
	bullets: [
		"Track your visibility across AI answer engines",
		"Benchmark your brand against competitors",
		"Find the citations and sources behind every answer",
		"Self-host it, or bring your own model and scraper keys",
	],
};

export function SalesPanel() {
	return (
		<div className="flex flex-1 flex-col justify-between gap-8">
			<h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-balance">{PITCH.headline}</h2>

			<ul className="space-y-2.5">
				{PITCH.bullets.map((bullet) => (
					<li key={bullet} className="flex items-start gap-2.5 text-sm">
						<IconCheck className="mt-0.5 size-4 shrink-0 text-primary" />
						<span>{bullet}</span>
					</li>
				))}
			</ul>

			<EngineStrip />
		</div>
	);
}

/** The coverage claim, spelled out. Names sit beside logos because three Google surfaces share a mark. */
function EngineStrip() {
	return (
		<div>
			<p className="font-mono text-[10px] uppercase leading-none tracking-[0.2em] text-muted-foreground">Tracking</p>
			<ul className="mt-3 flex flex-wrap gap-1.5">
				{ENGINES.map((engine) => (
					<li
						key={engine.model}
						className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-[11px] leading-none"
					>
						<ModelIcon iconId={engine.iconId} className="size-3 shrink-0 text-muted-foreground" />
						{engine.label}
					</li>
				))}
			</ul>
		</div>
	);
}

/** The bottom of the form column: where to read more. */
export function SalesFooterLinks(): ReactNode {
	const linkClass = "hover:text-foreground";
	return (
		<div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
			<p className="flex flex-wrap items-center gap-x-4 gap-y-1">
				<a href={PROJECT_DOCS_URL} className={linkClass}>
					Docs
				</a>
				<a href={PROJECT_GITHUB_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
					GitHub
				</a>
			</p>
			<span>{DEFAULT_APP_NAME}</span>
		</div>
	);
}
