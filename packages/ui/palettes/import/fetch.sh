#!/usr/bin/env sh
# Downloads the official palette files (pinned versions) into $1, then import.py maps them onto Beam tokens:
#   sh fetch.sh /tmp/pal && python import.py /tmp/pal ../sources.ts
set -eu
D="$1"; mkdir -p "$D"
for c in gray slate sage mauve olive sand indigo teal amber violet grass crimson green red; do
  curl -fsSL "https://unpkg.com/@radix-ui/colors@3.0.0/$c.css" -o "$D/radix-$c.css"
  curl -fsSL "https://unpkg.com/@radix-ui/colors@3.0.0/$c-dark.css" -o "$D/radix-$c-dark.css"
done
curl -fsSL "https://unpkg.com/@carbon/themes@11.85.0/js/generated/themes/white.js" -o "$D/carbon-white.js"
curl -fsSL "https://unpkg.com/@carbon/themes@11.85.0/js/generated/themes/g100.js" -o "$D/carbon-g100.js"
curl -fsSL "https://unpkg.com/@carbon/colors@11.62.0/js/generated/colors.js" -o "$D/carbon-colors.js"
curl -fsSL "https://unpkg.com/@catppuccin/palette@1.8.0/css/catppuccin.css" -o "$D/catppuccin.css"
curl -fsSL "https://unpkg.com/@rose-pine/palette@4.0.1/dist/css/rose-pine-class.css" -o "$D/rosepine.css"
curl -fsSL "https://raw.githubusercontent.com/kepano/flexoki/8d723bac4a9ac46adfdf99d42155286977aac72a/css/flexoki.css" -o "$D/flexoki.css"
