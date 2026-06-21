import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export type emailVerificationProps = {
  message: string;
};

export type verifyOtpProps = {
  email: string;
  otp: string;
};

export const useVerifyOtp = () => {
  const { mutate } = useMutation({
    mutationFn: (verificationOtp: verifyOtpProps) =>
      apiFetch<emailVerificationProps>("/user/email-verify", {
        method: "POST",
        body: JSON.stringify(verificationOtp),
      }),
  });

  return { mutate };
};
