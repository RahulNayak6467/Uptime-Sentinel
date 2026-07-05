"use client";
import EmailAddressInput from "@/components/ui/email-address";
import GoogleIcon from "@/components/ui/google-icon";
import PasswordInput from "@/components/ui/password-input";
import UptimeSentinelImage from "@/components/ui/uptime-sentinel";
import { useForm } from "react-hook-form";
import { loginSchema, loginSchemaProps } from "../schemas/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hooks/useLogin";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api-error";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginSchemaProps>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useLogin();
  const router = useRouter();
  const onSubmit = (data: loginSchemaProps) => {
    const userLoginDetails = {
      email: data.email.trim().toLowerCase(),
      password: data.password,
    };
    console.log("Submitting login");

    mutate(userLoginDetails, {
      onSuccess: () => {
        router.push("/dashboard/overview");
      },
      onError: (err) => {
        console.log(err);
        if (err instanceof ApiError) {
          toast.error(err.message);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      },
    });
  };

  return (
    <section className="w-full max-w-[420px] rounded-lg border border-sf-border bg-sf-surface px-9 py-9 shadow-sf-card">
      <div className="flex justify-center items-center gap-2">
        <UptimeSentinelImage />
        <div>
          <p className="text-md text-sf-text font-bold font-sans">
            UptimeSentinel
          </p>
          <p className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-sf-text-muted">Monitoring</p>
        </div>
      </div>
      <div className="mt-6 w-full text-center">
        <h2 className="text-[20px] text-sf-text font-bold font-sans">
          Welcome back
        </h2>
        <p className="text-[13.5px] text-sf-text-sub leading-1.2 ">
          Sign in to your UptimeSentinel workspace
        </p>
      </div>

      <div className="mt-6 w-full">
        <button className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-sf-sm border border-sf-border bg-sf-surface px-4 py-2.5 transition-colors hover:border-sf-text-muted hover:bg-sf-bg">
          <GoogleIcon />
          <span className="text-[14px] font-semibold text-sf-text font-sans">
            Continue with Google
          </span>
        </button>

        <div className="flex items-center gap-3 mt-6">
          <div className="flex-1 h-px bg-sf-border" />
          <span className="text-[13px] text-sf-text-muted font-sans">
            or continue with email
          </span>
          <div className="flex-1 h-px bg-sf-border" />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 mt-4">
          <EmailAddressInput
            register={register}
            errors={errors.email?.message}
          />
          <div className="flex flex-col gap-1">
            <PasswordInput
              register={register}
              passwordType="Password"
              errors={errors.password?.message}
            />
            <div className="flex justify-end mt-1">
              <a
                href="/forgot-password"
                className="text-[12px] text-sf-text-sub hover:text-sf-text font-sans transition-colors"
              >
                Forgot password?
              </a>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-sf-text text-sf-btn-text text-[14px] font-semibold font-sans rounded-sf hover:bg-sf-btn-hover active:bg-sf-btn-active hover:text-sf-surface transition-colors cursor-pointer border border-sf-bg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Spinner label="Signing in" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>

        <p className="mt-5 text-center text-[13px] text-sf-text-sub font-sans">
          New to UptimeSentinel?{" "}
          <a
            href="/register"
            className="text-sf-text font-semibold hover:underline"
          >
            Create a free account
          </a>
        </p>
      </form>
    </section>
  );
}

export default LoginForm;
