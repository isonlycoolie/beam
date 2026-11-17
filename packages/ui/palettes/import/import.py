# Maps official open-source palettes onto Beam UI tokens and writes ../sources.ts.
# Usage: sh fetch.sh <dir> && python import.py <dir> ../sources.ts
# Roles follow each source's own documentation: Radix steps (1-2 backgrounds, 3-5 component states, 6-8 borders,
# 9-10 solids, 11-12 text), Carbon theme tokens, the Catppuccin style guide, Rosé Pine roles and Flexoki's
# generator (_generators/src/palette.ts: bg, bg-2, ui, ui-2, ui-3, tx-3, tx-2, tx).
import re, sys, json
P = sys.argv[1]; OUT = sys.argv[2]
def css_vars(path):
    t = open(f'{P}/{path}', encoding='utf-8').read()
    # Radix files hold a hex block first, then a P3 block; keep the first value of each variable.
    out = {}
    for k, v in re.findall(r'--([\w-]+):\s*(#[0-9a-fA-F]{6})', t):
        out.setdefault(k, v.lower())
    return out
def js_consts(path):
    return {k: v.lower() for k, v in re.findall(r"export const (\w+) = '(#[0-9a-fA-F]{6})'", open(f'{P}/{path}', encoding='utf-8').read())}

def radix(c, dark):
    v = css_vars(f'radix-{c}{"-dark" if dark else ""}.css')
    return {i: v[f'{c}-{i}'] for i in range(1, 13)}

palettes = []
def radix_palette(id, name, gray, accent, description):
    modes = {}
    for mode in ('light', 'dark'):
        g, a = radix(gray, mode == 'dark'), radix(accent, mode == 'dark')
        gr, am, rd = radix('green', mode == 'dark'), radix('amber', mode == 'dark'), radix('red', mode == 'dark')
        primary, ring = (g[12], g[8]) if gray == accent else (a[9], a[8])
        panel = g[2] if mode == 'dark' else '#ffffff'
        modes[mode] = {
            # Radix Themes panels: white in light, gray 2 in dark (--color-panel-solid).
            'background': g[1], 'surface-1': g[1], 'surface-2': g[2], 'surface-3': panel, 'card': panel, 'popover': panel,
            'muted': g[3], 'secondary': g[3], 'accent': g[4], 'border': g[6], 'input': g[7],
            'text-1': g[12], 'text-2': g[11], 'text-3': g[11],
            'primary': primary, 'ring': ring, 'link': g[12] if gray == accent else a[11],
            'success': gr[11], 'success-soft': gr[3], 'warning': am[11], 'warning-soft': am[3], 'danger': rd[11], 'danger-soft': rd[3],
            'chart-1': primary, 'chart-2': a[11] if gray != accent else g[10], 'chart-3': g[9], 'chart-4': g[7], 'chart-5': g[5],
        }
        # Radix: white text on most step-9 solids, dark text on the bright ones; the darkest gray is the dark option.
        modes[mode]['on-primary'] = [g[1]] if gray == accent else ['#ffffff', radix(gray, False)[12]]
    lg, la = radix(gray, False), radix(accent, False)
    display = [radix(gray, True)[1], lg[12], la[9], la[6], lg[2]] if gray != accent else [lg[12], lg[11], lg[9], lg[6], lg[2]]
    palettes.append(dict(id=id, name=name, description=description, source='Radix Colors', licence='MIT',
        url='https://github.com/radix-ui/colors', version='@radix-ui/colors 3.0.0', light=modes['light'], dark=modes['dark'], display=display))

radix_palette('default', 'Graphite', 'gray', 'gray', 'Radix Gray with a black primary. Pure greys; the Beam UI default.')
radix_palette('slate', 'Slate & Indigo', 'slate', 'indigo', 'Radix Slate greys with an Indigo primary. Cool and precise.')
radix_palette('sage', 'Sage & Teal', 'sage', 'teal', 'Radix Sage greys with a Teal primary. Calm, for health and care.')
radix_palette('sand', 'Sand & Amber', 'sand', 'amber', 'Radix Sand greys with an Amber primary. Warm, for hospitality.')
radix_palette('mauve', 'Mauve & Violet', 'mauve', 'violet', 'Radix Mauve greys with a Violet primary. For creative tools.')
radix_palette('olive', 'Olive & Grass', 'olive', 'grass', 'Radix Olive greys with a Grass primary. For finance and ledgers.')
radix_palette('crimson', 'Gray & Crimson', 'gray', 'crimson', 'Radix Gray with a Crimson primary. Bold, for media.')

