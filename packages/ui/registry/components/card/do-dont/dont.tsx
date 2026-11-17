import { Card, CardDescription, CardHeader, CardTitle } from "@beam/ui/components/card";

/** One long, one short: the row looks broken even though the cards are the same component. */
export default function CardDont() {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      <Card><CardHeader className="pb-5"><CardTitle>Instant payouts to any mobile wallet or bank</CardTitle><CardDescription>Money from every sale lands in your account the same day, including weekends and holidays.</CardDescription></CardHeader></Card>
      <Card><CardHeader className="pb-5"><CardTitle>Fees</CardTitle><CardDescription>Low.</CardDescription></CardHeader></Card>
    </div>
  );
}
