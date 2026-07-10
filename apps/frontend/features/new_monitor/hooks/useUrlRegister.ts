import { useMutation } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";

type urlRegisterProps = {
  url: string;
  urlName: string;
  intervalSeconds: string | number;
};

export const useUrlRegister = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (urlRegister: urlRegisterProps) =>
      apiFetch<ApiDataResponse<{ message: string }>>("/monitors", {
        method: "POST",
        body: JSON.stringify(urlRegister),
      }).then((res) => res.data),
  });

  return { mutate, isPending };
};
