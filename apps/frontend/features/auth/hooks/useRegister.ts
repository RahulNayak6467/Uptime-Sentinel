import { useMutation } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";

export type userRegistrationProps = {
  message: string;
};

export type userDetailsProps = {
  email: string;
  password: string;
};

export const useRegister = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (userDetails: userDetailsProps) =>
      apiFetch<ApiDataResponse<userRegistrationProps>>("/users", {
        method: "POST",
        body: JSON.stringify(userDetails),
      }).then((res) => res.data),
    retry: false,
  });

  return { mutate, isPending };
};
