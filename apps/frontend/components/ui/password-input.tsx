"use client";
import ErrorMessage from "@/features/auth/error";
import { useState } from "react";
import { UseFormRegister } from "react-hook-form";

const PasswordInput = ({
  passwordType,
  register,
  errors,
  autoComplete,
}: {
  passwordType: "Password" | "Confirm Password";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  errors?: string;
  autoComplete?: "current-password" | "new-password";
}) => {
  const [show, setShow] = useState(false);
  const passwordSchema =
    passwordType === "Password" ? "password" : "confirmPassword";
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-medium text-sf-text-sub"
        htmlFor={`user-${passwordSchema}`}
      >
        {passwordType}
      </label>
      <div className="relative">
        <input
          {...register(passwordSchema)}
          className="h-10 w-full rounded-md border border-sf-border bg-sf-bg/50 px-3 pr-10 text-sm text-sf-text outline-none transition-[background-color,border-color,box-shadow] placeholder:text-sf-text-muted focus:border-sf-blue/60 focus:bg-sf-surface focus:ring-2 focus:ring-sf-blue/10 aria-[invalid=true]:border-sf-red"
          type={show ? "text" : "password"}
          id={`user-${passwordSchema}`}
          autoComplete={
            autoComplete ??
            (passwordType === "Password" ? "current-password" : "new-password")
          }
          aria-invalid={Boolean(errors)}
          placeholder="At least 8 characters"
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-sm text-sf-text-muted transition-colors hover:text-sf-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/25"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      </div>
      {errors && <ErrorMessage error={errors} />}
    </div>
  );
};

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default PasswordInput;
