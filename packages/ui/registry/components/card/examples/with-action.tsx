import { Badge } from "@beam/ui/components/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@beam/ui/components/card";

export default function CardWithAction() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Payouts</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
        <CardAction>
          <Badge variant="success">On schedule</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-h2 text-numeric">TZS 48.2m</p>
      </CardContent>
    </Card>
  );
}
