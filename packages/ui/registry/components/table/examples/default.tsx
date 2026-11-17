import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@beam/ui/components/table";

const ROWS = [
  ["Visa (debit)", "4000 0566 5566 5556", "Any 3 digits", "Any future date"],
  ["Mastercard", "5555 5555 5555 4444", "Any 3 digits", "Any future date"],
  ["American Express", "3782 822463 10005", "Any 4 digits", "Any future date"],
];

export default function TableDefault() {
  return (
    <Table className="w-[640px]">
      <TableHeader>
        <TableRow className="border-0 hover:bg-transparent">
          <TableHead>Brand</TableHead>
          <TableHead>Number</TableHead>
          <TableHead>CVC</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map(([brand, number, cvc, date]) => (
          <TableRow key={number}>
            <TableCell>{brand}</TableCell>
            <TableCell className="font-[family-name:var(--theme-font-mono)] font-medium text-text-1">{number}</TableCell>
            <TableCell>{cvc}</TableCell>
            <TableCell>{date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
