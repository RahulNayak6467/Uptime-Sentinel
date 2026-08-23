import { PoolClient } from "pg";
import logger from "../../config/logger";
import { db } from "../../db/index";
import {
  addReminderEmailQueue,
  addToDownAlertEmailQueue,
  addToRecoveryEmailQueue,
} from "../../queue/alertEmailQueue";
import { getMinutesDifference } from "../../shared/utils/formatDate";
import { getActiveIncident, insertIntoIncidentsTable, updateResolvedAt } from "./shared/incidentLifecycle";
import { checkConsecutiveSuccess, getThresholdValues, hasConsecutiveFailures } from "./shared/threshold";

export const runStateMachine = async (
  user_id: string,
  url_id: string,
  status: "UP" | "DOWN"
) => {
  const activeIncident = await getActiveIncident(url_id);
  const currentState = activeIncident ? "INCIDENT_ACTIVE" : "NO_INCIDENT";
  const event = status === "DOWN" ? "URL_DOWN" : "URL_UP";

  const {failureThresholdCount,recoveryThresholdCount} = await getThresholdValues(user_id,url_id)

  const transitions = {
    "NO_INCIDENT:URL_DOWN": async () => {
      const isUrlDown = await hasConsecutiveFailures(url_id,failureThresholdCount);
      // await updateMonitorStatus(status, user_id, url_id);
      if (!isUrlDown) {
        return;
      }

      const client = await db.connect();
      let incident_id;
      try {
        await client.query("BEGIN");
        incident_id = await insertIntoIncidentsTable(client, url_id);
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
      finally {
        client.release();
      }

      await addToDownAlertEmailQueue(url_id, incident_id, null);
    },
    "NO_INCIDENT:URL_UP": async () => {
      // await updateMonitorStatus(status, user_id, url_id);
    },
    "INCIDENT_ACTIVE:URL_DOWN": async () => {
      const reminderEmailTime = getMinutesDifference(
        activeIncident.last_alert_sent_at,
      );
        // await updateMonitorStatus(status, user_id, url_id);
      if (reminderEmailTime > 2) {
        await addReminderEmailQueue(url_id, activeIncident.id);
      } else {
        return;
      }
    },
    "INCIDENT_ACTIVE:URL_UP": async () => {
      const isUrlUp = await checkConsecutiveSuccess(url_id,user_id,recoveryThresholdCount)
      // await updateMonitorStatus(status, user_id, url_id);
      if (!isUrlUp) {
        return
      }

      const client = await db.connect();
      try {
        await client.query("BEGIN");
        await updateResolvedAt(client, activeIncident.id);
        await client.query("COMMIT")
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
      finally {
        client.release();
      }

      await addToRecoveryEmailQueue(url_id, activeIncident.id);
    },
  };

  logger.debug(
    { currentState, event },
    "Event type as processed by state machine",
  );

  const action = transitions[`${currentState}:${event}`];

  await action();
};
