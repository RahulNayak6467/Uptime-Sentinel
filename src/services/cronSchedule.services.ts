import { db } from "../db/index";

export const pauseUrl = async (url_id: string, user_id: string) => {
  const pause_url_query =
    "UPDATE monitor set is_active = false where id = $1 and user_id = $2";
  const pause_url_value = [url_id, user_id];
  try {
    const isPaused = await db.query(pause_url_query, pause_url_value);

    return;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};

export const resumeUrl = async (url_id: string, user_id: string) => {
  console.log(user_id);
  console.log(url_id);
  const pause_url_query =
    "UPDATE monitor set is_active = true where id = $1 and user_id = $2";
  const pause_url_value = [url_id, user_id];
  try {
    const isResumed = await db.query(pause_url_query, pause_url_value);
    return;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
