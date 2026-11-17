import { NativeSelect } from "@beam/ui/components/native-select";

export default function NativeSelectDefault() {
  return (
    <NativeSelect aria-label="Country" defaultValue="tz">
      <option value="tz">Tanzania</option>
      <option value="ke">Kenya</option>
      <option value="us">United States</option>
    </NativeSelect>
  );
}
