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
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-semibold" htmlFor="userEmail">
        Email address
      </label>
      <input
        {...register("email")}
        className="rounded-sf-sm border border-sf-border bg-sf-surface px-3 py-2.5 text-[14px] outline-none transition-[border-color,box-shadow] focus:border-sf-blue focus:shadow-sf-focus"
        type="email"
        id="userEmail"
        placeholder="name@example.com"
      />
      {errors && <ErrorMessage error={errors} />}
    </div>
  );
};

export default EmailAddressInput;
