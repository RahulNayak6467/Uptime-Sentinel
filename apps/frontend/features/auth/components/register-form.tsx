"use client";
import EmailAddressInput from "@/components/ui/email-address";
import PasswordInput from "@/components/ui/password-input";
import AuthFormHeader from "./auth-form-header";
import SocialAuthButtons from "./social-auth-buttons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  registerSchemaProps,
} from "../schemas/register-schema";
import { useRegister } from "../hooks/useRegister";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api-error";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";
import Link from "next/link";

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerSchemaProps>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();

  const { mutate, isPending } = useRegister();
  const onSubmit = (data: registerSchemaProps) => {
    const userDetails = {
      email: data.email.trim().toLowerCase(),
      password: data.password,
    };

    mutate(userDetails, {
      onSuccess: () => {
        router.push("/verify-email");
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          toast.error(err.message);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      },
    });
  };

  return (
    <section className="w-full">
      <AuthFormHeader
        title="Create your account"
        description="Set up your workspace and start monitoring endpoints."
      />

      <SocialAuthButtons dividerLabel="or sign up with email" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-6 flex flex-col gap-4">
          <EmailAddressInput
            register={register}
            errors={errors.email?.message}
          />
          <div className="flex flex-col gap-1">
            <PasswordInput
              register={register}
              errors={errors.password?.message}
              passwordType="Password"
              autoComplete="new-password"
            />
          </div>
          <PasswordInput
            register={register}
            errors={errors.confirmPassword?.message}
            passwordType="Confirm Password"
          />
          {/*<label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              required
              className="peer hidden"
              id="terms"
            />
            <span className="mt-0.5 w-4 h-4 min-w-4 rounded-[4px] border border-sf-border bg-sf-surface flex items-center justify-center transition-colors peer-checked:bg-sf-text peer-checked:border-sf-text group-has-[:checked]:bg-sf-text group-has-[:checked]:border-sf-text">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-[13px] text-sf-text-sub font-sans leading-snug">
              I agree to the{" "}
              <a
                href="/terms"
                className="font-bold text-sf-text hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="font-bold text-sf-text hover:underline"
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>*/}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-5 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-sf-text px-4 text-sm font-semibold text-sf-btn-text shadow-sm transition-[background-color,box-shadow,transform] hover:-translate-y-px hover:bg-sf-btn-hover hover:shadow-md active:translate-y-0 active:bg-sf-btn-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-sf-text disabled:hover:shadow-sm"
        >
          {isPending ? (
            <>
              <Spinner label="Creating account" />
              Creating account…
            </>
          ) : (
            "Create Account"
          )}
        </button>

        <p className="mt-6 text-center text-[13px] text-sf-text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-sf-text transition-colors hover:text-sf-blue"
          >
            Sign in
          </Link>
        </p>
      </form>
    </section>
  );
}

export default RegisterForm;
