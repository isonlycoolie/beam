import { Button } from "@beam/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@beam/ui/components/card";

export default function CardDefault() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Team plan</CardTitle>
        <CardDescription>For teams that ship together.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-h2 text-numeric">$24<span className="text-small font-normal text-text-2"> per seat / month</span></p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Start free trial</Button>
      </CardFooter>
    </Card>
  );
}
