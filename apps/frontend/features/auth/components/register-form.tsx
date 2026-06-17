import EmailAddressInput from "@/components/ui/email-address";
import GoogleIcon from "@/components/ui/google-icon";
import PasswordInput from "@/components/ui/password-input";
import UptimeSentinelImage from "@/components/ui/uptime-sentinel";
import FullNameInput from "./full-name";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  registerSchemaProps,
} from "../schemas/register-schema";

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerSchemaProps>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: registerSchemaProps) => {
    console.log(data);
  };

  return (
    <section className=" w-100 bg-sf-surface px-8 py-8 border border-sf-border rounded-[12px] shadow-sf-card">
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
          Create your account
        </h2>
        <p className="text-[13.5px] text-sf-text-sub leading-1.2 ">
          Start monitoring in under a minute
        </p>
      </div>

      <div className="mt-6 w-full">
        <button className="w-full flex items-center justify-center gap-3 px-4 py-1.5 border border-sf-border rounded-sf bg-sf-surface hover:bg-sf-bg transition-colors cursor-pointer">
          <GoogleIcon />
          <span className="text-[14px] font-semibold text-sf-text font-sans">
            Continue with Google
          </span>
        </button>

        <div className="flex items-center gap-3 mt-6">
          <div className="flex-1 h-px bg-sf-border" />
          <span className="text-[13px] text-sf-text-muted font-sans">
            or sign up with email
          </span>
          <div className="flex-1 h-px bg-sf-border" />
        </div>
      </div>
      <form>
        <div className="flex flex-col gap-4 mt-4">
          <FullNameInput register={register} errors={errors.name?.message} />
          <EmailAddressInput
            register={register}
            errors={errors.email?.message}
          />
          <div className="flex flex-col gap-1">
            <PasswordInput
              register={register}
              errors={errors.password?.message}
              passwordType="Password"
            />
          </div>
          <PasswordInput
            register={register}
            errors={errors.confirmPassword?.message}
            passwordType="Confirm Password"
          />
          <label className="flex items-start gap-2.5 cursor-pointer group">
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
          </label>
        </div>

        <button
          type="submit"
          className="mt-4 w-full py-2.5 bg-sf-text text-white text-[14px] font-semibold font-sans rounded-sf hover:bg-sf-btn-hover active:bg-sf-btn-active transition-colors cursor-pointer border border-sf-bg"
        >
          Create Account
        </button>

        <p className="mt-5 text-center text-[13px] text-sf-text-sub font-sans">
          <a
            href="/register"
            className="text-sf-text-sub font-semibold hover:underline"
          >
            Already have an account?
            <span className="text-sf-text">Sign in</span>
          </a>
        </p>
      </form>
    </section>
  );
}

export default RegisterForm;
