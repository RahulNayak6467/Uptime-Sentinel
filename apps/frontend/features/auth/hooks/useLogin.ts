import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export type userLoginResponseProps = {
  message: string;
};

export type userLoginProps = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (userLoginDetails: userLoginProps) =>
      apiFetch<userLoginResponseProps>("/user/login", {
        method: "POST",
        body: JSON.stringify(userLoginDetails),
      }),
    retry: false,
  });

  return { mutate, isPending };
};
