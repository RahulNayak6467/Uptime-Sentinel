"use client";

import { useState } from "react";
import HttpMonitorForm from "./http-monitor-form";
import TlsMonitorForm from "./tls-monitor-form";

const NewMonitorProperties = () => {
  const [monitorType, setMonitorType] = useState("HTTP/HTTPS");
  const isTls = monitorType === "TLS Cert";

  return isTls ? (
    <TlsMonitorForm monitorType={monitorType} onSelectType={setMonitorType} />
  ) : (
    <HttpMonitorForm monitorType={monitorType} onSelectType={setMonitorType} />
  );
};

export default NewMonitorProperties;
