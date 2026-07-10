type PostgresError = {
  code?: string
}

export const isPostgresError = (error: unknown): error is PostgresError => {
  return error instanceof Error && "code" in error
}
