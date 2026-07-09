import { QueryResult } from "pg"
import { db } from "../db"
import { AppError } from "../errors/AppError"
import { AuthMeProps } from "../types/db-types"

export const checkUserServices = async (user_id: string) => {
  const check_user_query = "Select id,created_at,email_verified,email from user_details where id = $1"
  const check_user_value = [user_id]

  const getUserId:QueryResult<AuthMeProps> = await db.query(check_user_query, check_user_value)

  const rows = getUserId.rows

  if (rows.length === 0) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
  }

  return rows[0]
}
