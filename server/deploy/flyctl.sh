#!/usr/bin/env bash

set -eu -o pipefail

here="$(builtin cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

export PATH=~/.fly/bin:$PATH
flyctl --config "${here}/fly.toml" "$@"
