import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiFetch, ApiDataResponse } from "@/lib/api";

export const useLogout = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      apiFetch<ApiDataResponse<{ message: string }>>("/auth/logout", {
        method: "POST",
      }).then((res) => res.data),
    onSettled: () => {
      router.push("/login");
    },
  });

  return { logout: mutate, isPending };
};
