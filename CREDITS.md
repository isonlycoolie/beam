# Credits

Beam builds on excellent open-source work. Thank you to everyone behind these projects.

## Components and UI

| Project | Licence | Used for |
| --- | --- | --- |
| [shadcn/ui](https://github.com/shadcn-ui/ui) | MIT | The components Beam UI restyles. Each restyled component keeps a "Based on shadcn/ui (MIT)" note |
| [Radix UI](https://github.com/radix-ui/primitives) (`radix-ui` 1.8.1) | MIT | Accessible behaviour under the components |
| [Hugeicons](https://hugeicons.com) free Stroke Rounded set (`@hugeicons/core-free-icons` 4.4.0, `@hugeicons/react` 1.1.10) | MIT | Every icon in Beam UI. Only the free set is used; Hugeicons Pro is not redistributed |
| [class-variance-authority](https://github.com/joe-bell/cva) 0.7.1 | Apache 2.0 | Component variants |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) 3.7.0 | MIT | Class merging |
| [clsx](https://github.com/lukeed/clsx) 2.1.1 | MIT | Class joining |
| [shadcn/ui blocks](https://github.com/shadcn-ui/ui/tree/968d8cb9dc42ae5d52e8fd356cf84596ec832a26/apps/v4/registry/new-york-v4/blocks) (commit 968d8cb) | MIT | Beam Screens: dashboard-01, sidebar-01 to 16, login-01 to 05 and signup-01 to 05, converted to Beam components, icons and tokens |
| [TanStack Table](https://github.com/TanStack/table) 9.3.1, [dnd kit](https://github.com/clauderic/dnd-kit) 6.3.1, [Zod](https://github.com/colinhacks/zod) 3.25.76 | MIT | The analytics dashboard screen's data table |
| [Unsplash](https://unsplash.com/license) photo `photo-1497366216548-37526070297c` | Unsplash License | The image on the login and sign-up screens |
| [liquid-glass-react](https://github.com/rdev/liquid-glass-react/tree/ac48eab18d1f7f444ae30002d240cae29c863a21) (commit ac48eab), which adapts [shuding/liquid-glass](https://github.com/shuding/liquid-glass) | MIT | Liquid Glass and the Tab Bar: the displacement map, the refraction filter with chromatic aberration, the rims and the elastic stretch, ported into one component |
| [einui](https://github.com/einui/einui/tree/243f89a9b9582b4b14f36b62b6c65964f2bcbb85/registry/liquid-glass) (commit 243f89a) | MIT | Glass mode: blur, border and shadow values for each surface tier in `styles/glass.css` |
| [Unsplash](https://unsplash.com/license) photos `photo-1506905925346-21bda4d32df4`, `photo-1469474968028-56623f02e42e`, `photo-1501785888041-af3ef285b470`, `photo-1470071459604-3b5ec3a7fe05`, `photo-1500530855697-b586d89ba3ee`, `photo-1519681393784-d120267933ba` | Unsplash License | The backgrounds behind glass previews and the Tab Bar demo |

## Design references (visual only)

Beam UI's component sizes, spacing, radius, shadows and type, and the palette showcases, were measured from these
products' public pages and rebuilt in Beam's own code. No code, logos, images or fonts from them are used. This is the
only place they are credited.

| Product | What was measured |
| --- | --- |
| [Stripe](https://stripe.com) (public Checkout demo, Stripe Docs, stripe.com) | Component sizes and states, the accounts table and usage billing showcases |
| [Neon](https://neon.com/pricing) (public pricing page) | The pricing plans showcase |
| [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/color) (public) | The Tab Bar's colours: system blue (increased contrast) and system grey 5 |

## Docs site

| Project | Licence | Used for |
| --- | --- | --- |
| [Fumadocs](https://github.com/fuma-nama/fumadocs) (`fumadocs-ui`, `fumadocs-core` 16.19.4, `fumadocs-mdx` 15.6.3) | MIT | Docs framework |
| [Next.js](https://github.com/vercel/next.js) 16.2.1 | MIT | Docs app |
| [Lenis](https://github.com/darkroomengineering/lenis) 1.3.27 | MIT | Smooth scrolling |

## Fonts

| Font | Licence | Used for |
| --- | --- | --- |
| [Sora](https://github.com/sora-xor/sora-font) | SIL Open Font License 1.1 | Wordmark (outlined in the logo files) |
| [Geist](https://github.com/vercel/geist-font) | SIL Open Font License 1.1 | Docs and Beam UI text, headings and numbers |
| [Geist Mono](https://github.com/vercel/geist-font) | SIL Open Font License 1.1 | Code |

Licences were read from each package's own licence file on 2026-11-17.
