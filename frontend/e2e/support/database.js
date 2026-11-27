import { Client } from 'pg'
import { e2eConfig } from './config.js'

function connection(database) {
  return {
    host: e2eConfig.database.host,
    port: e2eConfig.database.port,
    user: e2eConfig.database.user,
    password: e2eConfig.database.password,
    database,
  }
}

export async function withDatabase(database, callback) {
  const client = new Client(connection(database))
  await client.connect()
  try {
    return await callback(client)
  } finally {
    await client.end()
  }
}

export async function ensureDatabase() {
  await withDatabase('postgres', async (client) => {
    const { rowCount } = await client.query('select 1 from pg_database where datname = $1', [
      e2eConfig.database.name,
    ])

    if (rowCount === 0) {
      const quotedName = `"${e2eConfig.database.name.replace(/"/g, '""')}"`
      await client.query(`create database ${quotedName}`)
    }
  })
}

export async function resetPublicSchema() {
  await withDatabase(e2eConfig.database.name, async (client) => {
    await client.query('drop schema if exists public cascade')
    await client.query('create schema public')
    await client.query('grant all on schema public to public')
  })
}

export async function deleteE2eUsers() {
  return withDatabase(e2eConfig.database.name, async (client) => {
    const result = await client.query(
      "delete from users where email like 'e2e.%@digitacourse.test'",
    )
    return result.rowCount
  })
}
