#!/usr/bin/env bash

set -eux -o pipefail

here="$(builtin cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${here}/../.."

export DOCKER_BUILDKIT=1
docker build \
    -f "${here}/Dockerfile" \
    -t worshipmate/server:latest \
    .
