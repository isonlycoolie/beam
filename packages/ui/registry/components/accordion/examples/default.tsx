import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@beam/ui/components/accordion";

export default function AccordionDefault() {
  return (
    <Accordion type="single" collapsible className="w-[420px]">
      <AccordionItem value="fees">
        <AccordionTrigger>How are fees charged?</AccordionTrigger>
        <AccordionContent>Fees come out of each payment before it reaches your balance.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="payouts">
        <AccordionTrigger>When do payouts arrive?</AccordionTrigger>
        <AccordionContent>Two business days after a payment succeeds.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
