import { useMutation } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";

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
      apiFetch<ApiDataResponse<userLoginResponseProps>>("/auth/login", {
        method: "POST",
        body: JSON.stringify(userLoginDetails),
      }).then((res) => res.data),
    retry: false,
  });

  return { mutate, isPending };
};
