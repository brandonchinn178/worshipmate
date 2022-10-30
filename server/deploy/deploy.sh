#!/usr/bin/env bash

set -eu -o pipefail

here="$(builtin cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# https://community.fly.io/t/support-specifying-local-only-in-fly-toml/6656
"${here}/flyctl.sh" deploy --local-only --image worshipmate/server
