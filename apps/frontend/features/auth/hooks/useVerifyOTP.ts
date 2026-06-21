import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import { toast } from "sonner";

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
    onError: (err) => {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
    retry: false,
  });

  return { mutate };
};
