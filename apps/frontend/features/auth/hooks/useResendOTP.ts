import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export type resendEmailProps = {
  message: string;
};

export type resendOtpProps = {
  email: string;
};

export const useResendOTP = () => {
  const { mutate } = useMutation({
    mutationFn: (resendOtp: resendOtpProps) =>
      apiFetch<resendEmailProps>("/user/otp-resend", {
        method: "POST",
        body: JSON.stringify(resendOtp),
      }),
  });

  return { mutate };
};
