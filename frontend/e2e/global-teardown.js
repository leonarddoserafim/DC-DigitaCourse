import { deleteE2eUsers } from './support/database.js'

export default async function globalTeardown() {
  try {
    const removed = await deleteE2eUsers()
    console.log(`[e2e] Contas de teste removidas: ${removed}.`)
  } catch (error) {
    console.warn('[e2e] Não foi possível remover as contas de teste:', error.message)
  }
}
