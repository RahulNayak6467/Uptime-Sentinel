import ErrorMessage from "@/features/auth/error";
import { UseFormRegister } from "react-hook-form";

const EmailAddressInput = ({
  register,
  errors,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  errors?: string;
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-sf-text-sub" htmlFor="userEmail">
        Email address
      </label>
      <input
        {...register("email")}
        className="h-10 rounded-md border border-sf-border bg-sf-bg/50 px-3 text-sm text-sf-text outline-none transition-[background-color,border-color,box-shadow] placeholder:text-sf-text-muted focus:border-sf-blue/60 focus:bg-sf-surface focus:ring-2 focus:ring-sf-blue/10 aria-[invalid=true]:border-sf-red"
        type="email"
        id="userEmail"
        autoComplete="email"
        aria-invalid={Boolean(errors)}
        placeholder="name@example.com"
      />
      {errors && <ErrorMessage error={errors} />}
    </div>
  );
};

export default EmailAddressInput;
