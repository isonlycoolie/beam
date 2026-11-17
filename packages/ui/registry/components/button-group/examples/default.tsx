import { Button } from "@beam/ui/components/button";
import { ButtonGroup } from "@beam/ui/components/button-group";

export default function ButtonGroupDefault() {
  return (
    <ButtonGroup aria-label="Export">
      <Button variant="outline" size="sm">CSV</Button>
      <Button variant="outline" size="sm">PDF</Button>
      <Button variant="outline" size="sm">JSON</Button>
    </ButtonGroup>
  );
}
