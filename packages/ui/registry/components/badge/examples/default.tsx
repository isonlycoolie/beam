import { Badge } from "@beam/ui/components/badge";

export default function BadgeDefault() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Draft</Badge>
      <Badge variant="success">Paid</Badge>
      <Badge variant="warning">Due soon</Badge>
      <Badge variant="danger">Overdue</Badge>
      <Badge variant="primary">New</Badge>
      <Badge variant="outline">Archived</Badge>
    </div>
  );
}
