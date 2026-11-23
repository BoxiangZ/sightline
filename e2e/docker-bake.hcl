# The images e2e/.sightline/sightline.yaml would build, under the names the compose files
# give them. CI builds from this instead of `docker compose build` so the build
# can start before `sightline init` has generated that compose file.

group "default" {
  targets = ["web", "migrate", "worker"]
}

target "_sightline" {
  context    = "."
  dockerfile = "docker/Dockerfile"
}

target "web" {
  inherits = ["_sightline"]
  target   = "web"
  tags     = ["sightline-e2e-web"]
}

target "migrate" {
  inherits = ["_sightline"]
  target   = "migrate"
  tags     = ["sightline-e2e-migrate"]
}

target "worker" {
  inherits = ["_sightline"]
  target   = "worker"
  tags     = ["sightline-e2e-worker"]
}
