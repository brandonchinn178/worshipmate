#!/usr/bin/env bash

set -eux -o pipefail

root="$(git rev-parse --show-toplevel)"

main() {
    local out="${root}/src/lib/supabase/types.ts"
    npx supabase gen types --lang typescript --local > "$out"
    npx prettier --write "$out"
}

main
