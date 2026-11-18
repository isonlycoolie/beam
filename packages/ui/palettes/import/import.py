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

w, d = js_consts('carbon-white.js'), js_consts('carbon-g100.js')
cc = js_consts('carbon-colors.js')
def carbon(t, mode):
    return {
        'background': t['background'], 'surface-1': t['background'], 'surface-2': t['layer01'], 'surface-3': t['layer02'], 'card': t['layer01'], 'popover': t['layer02'],
        'muted': t['layer01'], 'secondary': t['layerAccent01'], 'accent': t['layerHover01'], 'border': t['borderSubtle01'], 'input': t['borderStrong01'],
        'text-1': t['textPrimary'], 'text-2': t['textSecondary'], 'text-3': t['textHelper'],
        'primary': cc['blue60'], 'on-primary': [t['textOnColor']], 'ring': t['focus'], 'link': t['linkPrimary'],
        # Carbon's support colours are for icons; on light layers, text takes the darker official step of the same hue.
        'success': cc['green60'] if mode == 'light' else t['supportSuccess'], 'success-soft': cc['green10'] if mode == 'light' else cc['gray90'],
        'warning': cc['yellow60'] if mode == 'light' else t['supportWarning'], 'warning-soft': cc['yellow10'] if mode == 'light' else cc['gray90'],
        'danger': t['textError'], 'danger-soft': cc['red10'] if mode == 'light' else cc['gray90'],
        'chart-1': cc['blue60'], 'chart-2': cc['purple60'], 'chart-3': cc['teal60'], 'chart-4': cc['cyan50'], 'chart-5': cc['gray50'],
    }
palettes.append(dict(id='carbon', name='Carbon', description="IBM's Carbon: the White and Gray 100 themes with Blue 60.", source='IBM Carbon Design System',
    licence='Apache-2.0', url='https://github.com/carbon-design-system/carbon', version='@carbon/themes 11.85.0, @carbon/colors 11.62.0',
    light=carbon(w, 'light'), dark=carbon(d, 'dark'), display=[cc['gray100'], cc['blue60'], cc['blue40'], cc['gray30'], cc['gray10']]))

ct = css_vars('catppuccin.css')
def ctp(f):
    g = lambda k: ct[f'ctp-{f}-{k}']
    return {
        'background': g('base'), 'surface-1': g('base'), 'surface-2': g('mantle'), 'surface-3': g('mantle'), 'card': g('mantle'), 'popover': g('mantle'),
        'muted': g('surface0'), 'secondary': g('surface0'), 'accent': g('surface1'), 'border': g('surface1'), 'input': g('surface2'),
        'text-1': g('text'), 'text-2': g('subtext1'), 'text-3': g('subtext0'),
        'primary': g('blue'), 'on-primary': [g('base'), ct['ctp-latte-base'], ct['ctp-mocha-crust']], 'ring': g('lavender'), 'link': g('blue'),
        'success': g('green'), 'success-soft': g('crust'), 'warning': g('yellow'), 'warning-soft': g('crust'), 'danger': g('red'), 'danger-soft': g('crust'),
        'chart-1': g('blue'), 'chart-2': g('mauve'), 'chart-3': g('teal'), 'chart-4': g('peach'), 'chart-5': g('overlay0'),
    }
palettes.append(dict(id='catppuccin', name='Catppuccin', description='Catppuccin Latte for light and Mocha for dark, with Blue.', source='Catppuccin',
    licence='MIT', url='https://github.com/catppuccin/palette', version='@catppuccin/palette 1.8.0', light=ctp('latte'), dark=ctp('mocha'),
    display=[ct['ctp-mocha-base'], ct['ctp-mocha-mauve'], ct['ctp-mocha-blue'], ct['ctp-mocha-peach'], ct['ctp-latte-base']]))

rp_t = open(f'{P}/rosepine.css', encoding='utf-8').read()
def rp(theme):
    block = re.search(r'\.' + re.escape(theme) + r'\s*\{([^}]*)\}', rp_t).group(1)
    v = {k: h.lower() for k, h in re.findall(r'--rp-([\w-]+):\s*(#[0-9a-fA-F]{6})', block)}
    return {
        'background': v['base'], 'surface-1': v['base'], 'surface-2': v['surface'], 'surface-3': v['overlay'], 'card': v['surface'], 'popover': v['surface'],
        'muted': v['overlay'], 'secondary': v['overlay'], 'accent': v['highlight-low'], 'border': v['highlight-med'], 'input': v['highlight-high'],
        'text-1': v['text'], 'text-2': v['subtle'], 'text-3': v['muted'],
        'primary': v['pine'], 'on-primary': ['#ffffff', v['base']], 'ring': v['iris'], 'link': v['foam'],