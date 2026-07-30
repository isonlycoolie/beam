import { navigation } from "../content/navigation";
import type { NavItem } from "../content/navigation";

type LeftSidebarProps = {
  activeSlug: string;
  variant?: "desktop" | "mobile";
};

export function LeftSidebar({
  activeSlug,
  variant = "desktop",
}: LeftSidebarProps) {
  return (
    <aside
      className={
        variant === "mobile" ? "leftSidebar mobileVariant" : "leftSidebar"
      }
    >
      {navigation.map((group) => (
        <section className="navGroup" key={group.title}>
          <h2>{group.title}</h2>
          {group.items.map((item) => (
            <NavLink
              activeSlug={activeSlug}
              groupTitle={group.title}
              item={item}
              key={`${group.title}-${item.title}`}
            />
          ))}
        </section>
      ))}
    </aside>
  );
}

function NavLink({
  activeSlug,
  groupTitle,
  item,
}: {
  activeSlug: string;
  groupTitle: string;
  item: NavItem;
}) {
  const isActive = isActiveItem(item.href, activeSlug);
  const hasActiveChild =
    item.children?.some((child) => isActiveItem(child.href, activeSlug)) ??
    false;

  return (
    <div className="navItem">
      <a
        className={isActive || hasActiveChild ? "active" : undefined}
        href={item.href}
      >
        {item.title}
      </a>
      {item.children ? (
        <div className="navChildren">
          {item.children.map((child) => (
            <a
              className={
                isActiveItem(child.href, activeSlug) ? "active" : undefined
              }
              href={child.href}
              key={`${groupTitle}-${item.title}-${child.title}`}
            >
              {child.title}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function isActiveItem(href: string, activeSlug: string) {
  if (href === "/" && activeSlug === "introduction") {
    return true;
  }

  return href === `/docs/${activeSlug}`;
}
