import ErrorMessage from "@/features/auth/error";
import { userRegister } from "@/features/auth/types";
import { FieldError } from "react-hook-form";

const EmailAddressInput = ({
  register,
  errors,
}: {
  register: userRegister;
  errors: undefined | string;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-semibold" htmlFor="userEmail">
        Email address
      </label>
      <input
        {...register("email")}
        {...(errors && <ErrorMessage error={errors} />)}
        className="text-[14px] border border-sf-border bg-sf-surface px-2 py-2 rounded-[6px]"
        type="email"
        id="userEmail"
        name="email"
        placeholder="name@example.com"
        required
      />
    </div>
  );
};

export default EmailAddressInput;
