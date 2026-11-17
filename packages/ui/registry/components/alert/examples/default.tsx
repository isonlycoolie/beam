import { Alert02Icon } from "@hugeicons/core-free-icons";
import { Alert, AlertDescription, AlertTitle } from "@beam/ui/components/alert";
import { Icon } from "@beam/ui/icons";

export default function AlertDefault() {
  return (
    <Alert className="w-[480px]">
      <Icon icon={Alert02Icon} size="sm" />
      <AlertTitle>Payouts are paused</AlertTitle>
      <AlertDescription>Add a bank account to restart them.</AlertDescription>
    </Alert>
  );
}
