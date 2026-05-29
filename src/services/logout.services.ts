import { AppError } from "../errors/AppError";
import { db } from "../index";

export const removeToken = async (user_id: string) => {
  const query = "DELETE FROM refresh_tokens WHERE user_id = $1";
  const values = [user_id];
  try {
    const removeToken = await db.query(query, values);
    const rows = removeToken.rowCount;
    if (!rows) {
      throw new AppError(200, "Already loggedout");
    }
    return "successfully logged out";
  } catch (error) {
    console.log("Error:", error.message);
    throw error;
  }
};
