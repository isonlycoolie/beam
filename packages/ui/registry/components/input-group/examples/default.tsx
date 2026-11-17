import { Search01Icon } from "@hugeicons/core-free-icons";
import { Kbd } from "@beam/ui/components/kbd";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@beam/ui/components/input-group";
import { Icon } from "@beam/ui/icons";

export default function InputGroupDefault() {
  return (
    <InputGroup className="w-[320px]">
      <InputGroupAddon>
        <Icon icon={Search01Icon} size="sm" />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search the docs" aria-label="Search the docs" />
      <InputGroupAddon>
        <Kbd>/</Kbd>
      </InputGroupAddon>
    </InputGroup>
  );
}
