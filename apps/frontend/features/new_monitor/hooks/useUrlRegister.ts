import { useMutation } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";
import { httpMonitorProps } from "../schemas/monitor-info";

type urlRegisterProps = {
  url: string;
  monitorName: string;
  intervalSeconds: number;
  contentType: httpMonitorProps["contentType"];
  failureThreshold: number;
  httpMethod: httpMonitorProps["httpMethod"];
  requestBody: string | null;
  requestBodyType: httpMonitorProps["requestBodyType"];
  requestTimeoutMS: number;
  responseTimeThresholdMS: number;
  statusCodes: httpMonitorProps["statusCodes"];
  monitorType: httpMonitorProps["monitorType"];
  recoveryThreshold: number;
};

export const useUrlRegister = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (urlRegister: urlRegisterProps) =>
      apiFetch<ApiDataResponse<string>>("/monitors", {
        method: "POST",
        body: JSON.stringify(urlRegister),
      }).then((res) => res.data),
  });

  return { mutate, isPending };
};
