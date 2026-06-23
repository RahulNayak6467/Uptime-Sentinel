import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

type urlRegisterProps = {
  url: string;
  urlName: string;
  intervalSeconds: string | number;
};

export const useUrlRegister = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (urlRegister: urlRegisterProps) =>
      apiFetch<{ message: string }>("/url/register", {
        method: "POST",
        body: JSON.stringify(urlRegister),
      }),
  });

  return { mutate, isPending };
};
