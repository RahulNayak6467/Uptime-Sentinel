import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export type userRegistrationProps = {
  message: string;
};

export type userDetailsProps = {
  email: string;
  password: string;
};

export const useRegister = () => {
  const { mutate } = useMutation({
    mutationFn: (userDetails: userDetailsProps) =>
      apiFetch<userRegistrationProps>("/user/registration", {
        method: "POST",
        body: JSON.stringify(userDetails),
      }),
  });

  return { mutate };
};
