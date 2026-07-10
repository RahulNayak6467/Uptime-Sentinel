import { useMutation } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import { toast } from "sonner";

export type resendEmailProps = {
  message: string;
};

export type resendOtpProps = {
  email: string;
};

export const useResendOTP = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (resendOtp: resendOtpProps) =>
      apiFetch<ApiDataResponse<resendEmailProps>>("/auth/otp-resends", {
        method: "POST",
        body: JSON.stringify(resendOtp),
      }).then((res) => res.data),
    onSuccess: () => {
      toast.success("Verification code sent. Check your inbox.");
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
    retry: false,
  });

  return { mutate, isPending };
};
