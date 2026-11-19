import { Add01Icon, Delete02Icon, File01Icon, Folder01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@beam/ui/components/button";
import { Tree, TreeSection, type TreeItem } from "@beam/ui/components/tree";
import { Icon } from "@beam/ui/icons";

const remove = (name: string) => (
  <Button variant="ghost" size="icon-xs" aria-label={`Delete ${name}`}>
    <Icon icon={Delete02Icon} size="sm" />
  </Button>
);

const ITEMS: TreeItem[] = [
  {
    id: "website",
    label: "Website",
    icon: Folder01Icon,
    children: [
      { id: "overview", label: "Overview", icon: File01Icon, actions: remove("Overview") },
      { id: "pricing", label: "Pricing", icon: File01Icon, actions: remove("Pricing") },
    ],
  },
  { id: "notes", label: "Notes", icon: File01Icon, actions: remove("Notes") },
];

export default function TreeSectionExample() {
  return (
    <TreeSection
      title="Projects"
      className="w-[260px]"
      action={
        <Button variant="ghost" size="icon-xs" aria-label="Add project">
          <Icon icon={Add01Icon} size="sm" />
        </Button>
      }
    >
      <Tree aria-label="Projects" items={ITEMS} defaultExpanded={["website"]} defaultSelected="pricing" />
    </TreeSection>
  );
}
