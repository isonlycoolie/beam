# Glass rules

## Where glass belongs

| Good | Why |
| --- | --- |
| Floating navigation bar over a page that scrolls under it | The blur shows depth and keeps context |
| Toolbars and controls over media (video, maps, photos) | Controls stay readable without hiding the content |
| Sheets, popovers, menus | Temporary layers feel above the page |
| One hero card over a rich image or gradient | A single focal surface |

| Avoid | Why |
| --- | --- |
| Glass on a flat solid background | Nothing to blur: it reads as a dull grey box |
| Every card in a grid | Noisy, low contrast, slow to render |
| Glass inside glass | Double blur turns to mud |
| Long text blocks on glass | Contrast shifts as the background moves |

## Contrast

The background behind glass changes, so check the worst spot. Raise the tint opacity (`--glass-tint`) until body text passes 4.5:1 everywhere it can scroll to. `beam craft review` measures contrast against solid painted backgrounds only; for glass over images, check the darkest and lightest areas by eye as well.

## Performance

`backdrop-filter` repaints whatever moves under it. Keep glass surfaces few and small, avoid animating their size, and do not put them over autoplaying video on low-end phones.

## Tuning

| Variable | Default | Raise it for |
| --- | --- | --- |
| `--glass-blur` | `14px` | Busier backgrounds |
| `--glass-tint` | `rgba(255,255,255,.12)` | More contrast (also try a darker tint with `tone="dark"`) |
| `--glass-edge` | `rgba(255,255,255,.45)` | A crisper rim on dark scenes |
| `--glass-radius` | `24px` | Pill bars use `999px` |
| `GlassFilter strength` | `42` | Stronger refraction (Chromium only) |
