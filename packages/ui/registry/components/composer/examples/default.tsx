import { Add01Icon, GitBranchIcon, Mic01Icon } from "@hugeicons/core-free-icons";
import { Composer, ComposerAction, ComposerFooter, ComposerInput, ComposerSubmit } from "@beam/ui/components/composer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@beam/ui/components/select";
import { Icon } from "@beam/ui/icons";

// The bar's selects sit quiet, like the ghost buttons beside them, until hovered.
const quiet = "border-transparent bg-transparent shadow-none hover:bg-secondary";

export default function ComposerDefault() {
  return (
    <Composer className="w-[520px]">
      <ComposerInput placeholder="Ask anything" />
      <ComposerFooter>
        <ComposerAction aria-label="Add files">
          <Icon icon={Add01Icon} size="sm" />
        </ComposerAction>
        <Select defaultValue="main">
          <SelectTrigger size="sm" aria-label="Branch" className={quiet}>
            <Icon icon={GitBranchIcon} size="sm" className="me-1.5 text-text-3" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="main">main</SelectItem>
            <SelectItem value="agent-workspace">feature/agent-workspace</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="fast">
          <SelectTrigger size="sm" aria-label="Model" className={`ms-auto ${quiet}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="fast">Fast model</SelectItem>
            <SelectItem value="deep">Deep model</SelectItem>
          </SelectContent>
        </Select>
        <ComposerAction aria-label="Dictate">
          <Icon icon={Mic01Icon} size="sm" />
        </ComposerAction>
        <ComposerSubmit />
      </ComposerFooter>
    </Composer>
  );
}
