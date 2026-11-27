const database = {
  host: process.env.DIGITACOURSE_E2E_DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DIGITACOURSE_E2E_DB_PORT ?? 5432),
  user: process.env.DIGITACOURSE_E2E_DB_USER ?? 'postgres',
  password: process.env.DIGITACOURSE_E2E_DB_PASSWORD ?? '',
  name: process.env.DIGITACOURSE_E2E_DB_NAME ?? 'digitacourse_e2e',
}

export const e2eConfig = {
  database,
  apiPort: Number(process.env.DIGITACOURSE_E2E_API_PORT ?? 8081),
  webPort: Number(process.env.DIGITACOURSE_E2E_WEB_PORT ?? 4173),
  jwtSecret:
    process.env.DIGITACOURSE_E2E_JWT_SECRET ??
    'digitacourse-e2e-local-secret-key-with-at-least-32-characters',
}

export const e2eDatabaseUrl = `jdbc:postgresql://${database.host}:${database.port}/${database.name}`
