# Anti-generic checklist (draft)

Run through this before you call UI finished. Each item is a common tell of generated UI.

| Tell | Why it reads as generic | Do instead |
| --- | --- | --- |
| Purple-to-pink gradient everywhere | The default AI aesthetic | Use the product's own colour; gradients only where they carry meaning |
| Gradient headline text | Overused, lowers legibility | Solid text; let size and weight lead |
| Everything centred | Hard to scan, looks like a template | Left-align reading content |
| Three equal feature cards with icons | Template pattern | Vary emphasis; show the product, not icons |
| Emoji as bullets or section icons | Unprofessional, inconsistent rendering | Real icons from one set, or none |
| "Unlock", "Supercharge", "Seamless", "Revolutionize" | Filler copy | Say what it does, specifically |
| Glassmorphism on every surface | Noisy, low contrast | Glass for one layer that floats over content (see Beam Glass) |
| Default framework palette and radius | Looks like every starter | Pick and apply the brand's tokens |
| 12 font sizes, 20 spacing values | No system | One type scale, one 4px spacing scale |
| Huge hero, then thin content | Style over substance | Put real content above the fold |
| Drop shadows on everything | Muddy depth | One or two elevation levels, used for meaning |
| Stock 3D blobs and abstract shapes | Decoration without content | Product screenshots, real photos, or nothing |

`npx usebeam craft review <url>` measures the ones that can be measured (gradient text, font and size sprawl, spacing grid, contrast). The rest need your judgement.
