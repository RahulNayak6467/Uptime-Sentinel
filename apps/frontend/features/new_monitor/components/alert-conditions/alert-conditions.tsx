"use client";

import { alertConditionsData } from "../../data";
import AlertTypes from "./alert-types";
import { controlProps } from "../../types";
import SectionHeader from "../section-header";

const AlertConditions = ({
  control,
  errors,
}: {
  control: controlProps;
  errors: {
    failureThreshold: string | undefined;
    recoveryThreshold: string | undefined;
  };
}) => {
  return (
    <div className="mt-4 w-full">
      <div className="h-full w-full overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
        <SectionHeader step="05" title="Alert conditions" description="Define when this monitor should trigger an incident" />
        <div className="px-5 pb-5">
          {alertConditionsData.map((data) => (
            <AlertTypes
              control={control}
              key={data.id}
              alertType={data.alertType}
              alertMessage={data.alertMessage}
              alertText={data.alertText}
              error={
                data.alertMessage === "success"
                  ? errors.recoveryThreshold
                  : errors.failureThreshold
              }
            />
          ))}

        </div>
      </div>
    </div>
  );
};

export default AlertConditions;
