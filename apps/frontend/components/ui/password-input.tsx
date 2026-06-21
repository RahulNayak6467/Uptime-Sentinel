"use client";
import ErrorMessage from "@/features/auth/error";
import { useState } from "react";
import { UseFormRegister } from "react-hook-form";

const PasswordInput = ({
  passwordType,
  register,
  errors,
}: {
  passwordType: "Password" | "Confirm Password";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  errors?: string;
}) => {
  const [show, setShow] = useState(false);
  const passwordSchema =
    passwordType === "Password" ? "password" : "confirmPassword";
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-[12px] text-sf-text font-semibold font-sans"
        htmlFor={`user-${passwordSchema}`}
      >
        {passwordType}
      </label>
      <div className="relative">
        <input
          {...register(passwordSchema)}
          className="w-full text-[14px] border border-sf-border bg-sf-surface px-3 py-2 pr-10 rounded-sf outline-none focus:border-sf-text transition-colors"
          type={show ? "text" : "password"}
          id={`user-${passwordSchema}`}
          placeholder="At least 8 characters"
        />
        {errors && <ErrorMessage error={errors} />}
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sf-text-muted hover:text-sf-text-sub transition-colors cursor-pointer"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      </div>
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
