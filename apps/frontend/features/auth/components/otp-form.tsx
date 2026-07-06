"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, OtpSchemaProps } from "../schemas/otp-schema";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import AuthFormHeader from "./auth-form-header";
import { useVerifyOtp } from "../hooks/useVerifyOTP";
import { useRouter } from "next/navigation";
import { useResendOTP } from "../hooks/useResendOTP";
import { useState } from "react";
import OtpError from "./otp-error";
import Spinner from "@/components/ui/spinner";

function OtpForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpSchemaProps>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });
  const router = useRouter();

  const [isOtpError, setIsOtpError] = useState<boolean>(false);
  const { mutate, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resendMutate, isPending: isResending } = useResendOTP();

  const onSubmit = (data: OtpSchemaProps) => {
    const otp: string = data.otp;
    const email = (process.env.NEXT_PUBLIC_EMAIL as string)
      .trim()
      .toLowerCase();

    mutate(
      { otp, email },
      {
        onSuccess: () => {
          router.push("/dashboard/overview");
        },
        onError: () => {
          setIsOtpError(() => true);
        },
      },
    );
  };

  const resendOtp = () => {
    const email = process.env.NEXT_PUBLIC_EMAIL as string;
    resendMutate({ email });
  };

  return (
    <section className="w-full">
      <AuthFormHeader
        title="Verify your email"
        description="Enter the six-digit code sent to your email address."
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-7 flex flex-col items-center gap-2">
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="size-11 text-base" />
                  <InputOTPSlot index={1} className="size-11 text-base" />
                  <InputOTPSlot index={2} className="size-11 text-base" />
                  <InputOTPSlot index={3} className="size-11 text-base" />
                  <InputOTPSlot index={4} className="size-11 text-base" />
                  <InputOTPSlot index={5} className="size-11 text-base" />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.otp && (
            <p className="text-xs text-sf-red">{errors.otp.message}</p>
          )}
          {isOtpError && <OtpError message="Invalid/expired OTP code" />}
        </div>

        <button
          type="submit"
          disabled={isVerifying || isResending}
          className="mt-6 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-sf-text px-4 text-sm font-semibold text-sf-btn-text shadow-sm transition-[background-color,box-shadow,transform] hover:-translate-y-px hover:bg-sf-btn-hover hover:shadow-md active:translate-y-0 active:bg-sf-btn-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-sf-text disabled:hover:shadow-sm"
        >
          {isVerifying ? (
            <>
              <Spinner label="Verifying email" />
              Verifying…
            </>
          ) : (
            "Verify Email"
          )}
        </button>

        <p className="mt-5 text-center text-[13px] text-sf-text-muted">
          Didn&apos;t receive a code?{" "}
          <button
            type="button"
            disabled={isVerifying || isResending}
            className="inline-flex items-center gap-1.5 font-semibold text-sf-text transition-colors hover:text-sf-blue disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => resendOtp()}
          >
            {isResending ? (
              <>
                <Spinner size={13} label="Resending verification code" />
                Sending…
              </>
            ) : (
              "Resend"
            )}
          </button>
        </p>
      </form>
    </section>
  );
}

export default OtpForm;
