# Screens

Finished screens built from Beam UI components. When the task is a dashboard, an app shell with a sidebar, a login or a sign-up page, start from the closest screen here: install it, then change its data and copy. Do not lay the page out from scratch.

- Install: `npx usebeam add screens/<id>` writes `app/<id>/page.tsx` and its parts in `components/`.
- Sidebar layouts also install as components: `npx usebeam add ui/<id>`.
- Read the full source first with the MCP tool `screens_get` (or list them with `screens_list`).
- Sample data sits at the top of each file or in `data.json`; replace it, keep the fields.

## Dashboard

| id | Use it for | Built from |
| --- | --- | --- |
| `dashboard-analytics` | Sidebar, metric cards, an area chart and a sortable, editable data table. | avatar, badge, button, card, chart, checkbox, drawer, dropdown-menu, input, label, select, separator, sidebar, table, tabs, toggle-group |

## Sidebar

| id | Use it for | Built from |
| --- | --- | --- |
| `sidebar-calendar` | A date picker and calendar list in the sidebar. | avatar, breadcrumb, calendar, collapsible, dropdown-menu, separator, sidebar |
| `sidebar-collapsible-sections` | Each section opens and closes on its own. | breadcrumb, collapsible, dropdown-menu, label, separator, sidebar |
| `sidebar-collapsible-submenus` | Parents that open to show their child pages, with search. | breadcrumb, collapsible, label, separator, sidebar |
| `sidebar-dropdown-submenus` | Child pages open in a dropdown, with an opt-in card. | breadcrumb, button, card, dropdown-menu, separator, sidebar |
| `sidebar-file-tree` | A collapsible file tree with changes on top. | breadcrumb, collapsible, separator, sidebar |
| `sidebar-floating` | A floating sidebar with submenus, inset from the edge. | breadcrumb, separator, sidebar |
| `sidebar-grouped` | Navigation grouped by section, with a version switcher and search. | breadcrumb, dropdown-menu, label, separator, sidebar |
| `sidebar-icon-collapse` | Team switcher, nested navigation, projects and a user menu; collapses to an icon rail. | avatar, breadcrumb, collapsible, dropdown-menu, separator, sidebar |
| `sidebar-in-dialog` | A settings dialog with its own sidebar. | breadcrumb, button, dialog, sidebar |
| `sidebar-in-popover` | Favorites, workspaces and a page actions popover. | breadcrumb, button, collapsible, dropdown-menu, popover, separator, sidebar |
| `sidebar-inset` | The page sits inset in a card; secondary links sit at the bottom. | avatar, breadcrumb, collapsible, dropdown-menu, separator, sidebar |
| `sidebar-left-and-right` | Navigation on the left, a calendar panel on the right. | avatar, breadcrumb, calendar, collapsible, dropdown-menu, separator, sidebar |
| `sidebar-nested-panels` | An icon rail and a second panel, like a mail app. | avatar, breadcrumb, dropdown-menu, label, separator, sidebar, switch |
| `sidebar-right` | A table of contents sidebar on the right. | breadcrumb, sidebar |
| `sidebar-sticky-header` | A full-width header above the sidebar and page. | avatar, breadcrumb, button, collapsible, dropdown-menu, label, separator, sidebar |
| `sidebar-submenus` | Parents with their child pages always shown. | breadcrumb, separator, sidebar |

## Login

| id | Use it for | Built from |
| --- | --- | --- |
| `login-cover-image` | Two columns: the form and a full-height image. | button, field, input |
| `login-email-only` | A magic-link style login with one email field. | button, field, input |
| `login-muted` | A centred card with social sign-in on a muted page. | button, card, field, input |
| `login-simple` | Email and password in one card. | button, card, field, input |
| `login-split-image` | Form and image side by side in one card. | button, card, field, input |

## Sign up

| id | Use it for | Built from |
| --- | --- | --- |
| `signup-cover-image` | Two columns: the form and a full-height image. | button, field, input |
| `signup-muted` | A centred card on a muted page. | button, card, field, input |
| `signup-simple` | Name, email and password in one card. | button, card, field, input |
| `signup-social` | Sign up with email or a provider. | button, field, input |
| `signup-split-image` | Form and image side by side in one card. | button, card, field, input |
