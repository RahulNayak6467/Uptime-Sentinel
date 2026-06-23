import z from "zod"

export const uuidSchema =   z.uuid("Monitor ID must be a valid UUID")