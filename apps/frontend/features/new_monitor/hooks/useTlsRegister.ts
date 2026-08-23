import { useMutation } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";
import { tlsRegisterPayloadProps } from "../types";

export const useTlsRegister = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: ({ linkedMonitorId, ...body }: tlsRegisterPayloadProps) => {
      const query = linkedMonitorId ? `?monitorId=${linkedMonitorId}` : "";
      return apiFetch<ApiDataResponse<string>>(`/monitors${query}`, {
        method: "POST",
        body: JSON.stringify(body),
      }).then((res) => res.data);
    },
  });

  return { mutate, isPending };
};
