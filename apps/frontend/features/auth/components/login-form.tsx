"use client";
import EmailAddressInput from "@/components/ui/email-address";
import PasswordInput from "@/components/ui/password-input";
import AuthFormHeader from "./auth-form-header";
import SocialAuthButtons from "./social-auth-buttons";
import { useForm } from "react-hook-form";
import { loginSchema, loginSchemaProps } from "../schemas/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hooks/useLogin";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api-error";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";
import Link from "next/link";

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
    mutate(userLoginDetails, {
      onSuccess: () => {
        router.push("/dashboard/overview");
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
        title="Welcome back"
        description="Sign in to continue to your monitoring workspace."
      />

      <SocialAuthButtons dividerLabel="or continue with email" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-6 flex flex-col gap-4">
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
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-5 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-sf-text px-4 text-sm font-semibold text-sf-btn-text shadow-sm transition-[background-color,box-shadow,transform] hover:-translate-y-px hover:bg-sf-btn-hover hover:shadow-md active:translate-y-0 active:bg-sf-btn-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-sf-text disabled:hover:shadow-sm"
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

        <p className="mt-6 text-center text-[13px] text-sf-text-muted">
          New to UptimeSentinel?{" "}
          <Link
            href="/register"
            className="font-semibold text-sf-text transition-colors hover:text-sf-blue"
          >
            Create a free account
          </Link>
        </p>
      </form>
    </section>
  );
}

export default LoginForm;
