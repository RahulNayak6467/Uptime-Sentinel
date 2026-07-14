import { useMutation } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";
import { monitorInfoProps } from "../schemas/monitor-info";

type urlRegisterProps = {
  url: string;
  monitorName: string;
  intervalSeconds: number;
  contentType: monitorInfoProps["contentType"];
  failureThreshold: number;
  httpMethod: monitorInfoProps["httpMethod"];
  requestBody: string | null;
  requestBodyType: monitorInfoProps["requestBodyType"];
  requestTimeoutMS: number;
  statusCodes: monitorInfoProps["statusCodes"];
  monitorType: monitorInfoProps["monitorType"];
  recoveryThreshold: number;
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
