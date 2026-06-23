"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import { otpSchema, OtpSchemaProps } from "../schemas/otp-schema";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import UptimeSentinelImage from "@/components/ui/uptime-sentinel";
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
    <section className="w-100 bg-sf-surface px-8 py-8 border border-sf-border rounded-[12px] shadow-sf-card">
      <div className="flex justify-center items-center gap-2">
        <UptimeSentinelImage />
        <div>
          <p className="text-md text-sf-text font-bold font-sans">
            UptimeSentinel
          </p>
          <p className="text-[9.5px] text-sf-text-muted">UPTIME</p>
        </div>
      </div>

      <div className="mt-6 w-full text-center">
        <h2 className="text-[20px] text-sf-text font-bold font-sans">
          Verify your email
        </h2>
        <p className="text-[13.5px] text-sf-text-sub mt-1">
          Enter the 6-digit code sent to your email address.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center gap-2 mt-8">
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
            <p className="text-[12px] text-red-500">{errors.otp.message}</p>
          )}
          {isOtpError && <OtpError message="Invalid/expired OTP code" />}
        </div>

        <button
          type="submit"
          disabled={isVerifying || isResending}
          className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 bg-sf-text text-sf-btn-text text-[14px] font-semibold font-sans rounded-sf hover:bg-sf-btn-hover active:bg-sf-btn-active hover:text-sf-surface transition-colors cursor-pointer border border-sf-bg disabled:opacity-50 disabled:cursor-not-allowed"
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

        <p className="mt-4 text-center text-[13px] text-sf-text-sub font-sans">
          Didn&apos;t receive a code?{" "}
          <button
            type="button"
            disabled={isVerifying || isResending}
            className="inline-flex items-center gap-1.5 text-sf-text font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50"
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
