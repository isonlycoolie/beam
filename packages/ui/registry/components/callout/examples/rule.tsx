import { Callout, CalloutTitle } from "@beam/ui/components/callout";

export default function CalloutRule() {
  return (
    <Callout variant="rule" className="w-[480px]">
      <CalloutTitle>Not a developer?</CalloutTitle>
      <p>Use a no-code option or an app from a partner to start taking payments without writing code.</p>
    </Callout>
  );
}
