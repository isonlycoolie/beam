import { InputOTP, InputOTPGroup, InputOTPSlot } from "@beam/ui/components/input-otp";

export default function InputOTPDefault() {
  return (
    <InputOTP maxLength={6} aria-label="Verification code">
      <InputOTPGroup>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
