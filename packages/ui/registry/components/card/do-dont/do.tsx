import { Card, CardDescription, CardHeader, CardTitle } from "@beam/ui/components/card";

/** Sibling copy rewritten to the same length: titles and descriptions line up (rule copy.sibling-parity). */
export default function CardDo() {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      <Card><CardHeader className="pb-5"><CardTitle>Instant payouts</CardTitle><CardDescription>Money lands the same day.</CardDescription></CardHeader></Card>
      <Card><CardHeader className="pb-5"><CardTitle>Clear fees</CardTitle><CardDescription>One rate, shown up front.</CardDescription></CardHeader></Card>
    </div>
  );
}
