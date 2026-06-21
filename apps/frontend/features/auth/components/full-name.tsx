import { UseFormRegister } from "react-hook-form";
import ErrorMessage from "../error";

const FullNameInput = ({
  register,
  errors,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  errors?: string;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-semibold" htmlFor="userName">
        Full name
      </label>
      <input
        {...register("name")}
        className="text-[14px] border border-sf-border bg-sf-surface px-2 py-2 rounded-[6px]"
        type="text"
        id="userName"
        placeholder="John Doe"
      />
      {errors && <ErrorMessage error={errors} />}
    </div>
  );
};

export default FullNameInput;
