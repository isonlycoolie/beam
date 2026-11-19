import { File01Icon, Folder01Icon } from "@hugeicons/core-free-icons";
import { Tree, type TreeItem } from "@beam/ui/components/tree";

const ITEMS: TreeItem[] = [
  {
    id: "website",
    label: "Website",
    icon: Folder01Icon,
    children: [
      { id: "overview", label: "Overview", icon: File01Icon },
      { id: "pricing", label: "Pricing", icon: File01Icon },
    ],
  },
  { id: "mobile", label: "Mobile app", icon: Folder01Icon, children: [{ id: "onboarding", label: "Onboarding", icon: File01Icon }] },
  { id: "archive", label: "Archive", icon: Folder01Icon, loading: true },
  { id: "notes", label: "Notes", icon: File01Icon },
];

export default function TreeDefault() {
  return <Tree aria-label="Projects" items={ITEMS} defaultExpanded={["website", "archive"]} defaultSelected="overview" className="w-[260px]" />;
}
