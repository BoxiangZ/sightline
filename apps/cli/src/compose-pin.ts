// No file I/O here, so the upgrade re-pin path stays unit-testable.

export function renderedByHeader(version: string): string {
	return [
		`# Rendered by sightline ${version} on ${new Date().toISOString()}`,
		"# Run `sightline upgrade` after upgrading the CLI to refresh this file.",
	].join("\n");
}

// Null for an install rendered before the header existed.
export function parseRenderedVersion(contents: string): string | null {
	const match = contents.match(/^# Rendered by sightline (\S+) on /m);
	return match ? match[1] : null;
}

// Adds the header when it is missing, so later upgrades can detect the version.
export function refreshHeaderVersion(contents: string, version: string): string {
	if (!/^# Rendered by sightline \S+ on /m.test(contents)) {
		return `${renderedByHeader(version)}\n${contents}`;
	}
	return contents.replace(
		/^# Rendered by sightline \S+ on .*$/m,
		`# Rendered by sightline ${version} on ${new Date().toISOString()}`,
	);
}

// Only Sightline's own images: a Postgres major bump needs a dump and restore, so
// rolling its tag would break the deployment.
export function repinImages(contents: string, version: string): string {
	return contents.replace(/(image:\s*sightlinehq\/sightline-[a-z-]+):\S+/g, `$1:${version}`);
}
