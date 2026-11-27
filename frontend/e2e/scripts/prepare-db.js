import { e2eConfig } from '../support/config.js'
import { ensureDatabase, resetPublicSchema } from '../support/database.js'

async function main() {
  console.log(
    `[e2e] Preparando o banco ${e2eConfig.database.name} em ${e2eConfig.database.host}:${e2eConfig.database.port}...`,
  )
  await ensureDatabase()
  await resetPublicSchema()
  console.log('[e2e] Banco pronto: schema public recriado para a execução.')
}

main().catch((error) => {
  console.error('[e2e] Falha ao preparar o banco:', error.message)
  console.error(
    '[e2e] Verifique se o PostgreSQL está em execução e se as variáveis DIGITACOURSE_E2E_DB_* estão corretas.',
  )
  process.exitCode = 1
})
