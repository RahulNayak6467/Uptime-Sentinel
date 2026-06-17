import { FieldError } from "react-hook-form";
import { userRegister } from "../types";
import ErrorMessage from "../error";

const FullNameInput = ({
  register,
  errors,
}: {
  register: userRegister;
  errors: undefined | string;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-semibold" for="userName">
        Full name
      </label>
      <input
        {...register("name")}
        {...(errors && <ErrorMessage error={errors} />)}
        className="text-[14px] border border-sf-border bg-sf-surface px-2 py-2 rounded-[6px]"
        type="text"
        id="userName"
        name="name"
        placeholder="John Doe"
        required
      />
    </div>
  );
};

export default FullNameInput;
