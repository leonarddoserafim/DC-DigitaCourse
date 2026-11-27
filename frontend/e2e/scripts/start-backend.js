import { spawn, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const backendDir = resolve(scriptDir, '../../../backend')
const isWindows = process.platform === 'win32'

function resolveMavenCommand() {
  const mavenHome = process.env.DIGITACOURSE_MAVEN_HOME ?? process.env.MAVEN_HOME
  const executable = isWindows ? 'mvn.cmd' : 'mvn'

  if (mavenHome) {
    const candidate = join(mavenHome, 'bin', executable)
    if (existsSync(candidate)) return candidate
  }

  return executable
}

const maven = resolveMavenCommand()
const command = isWindows && /\s/.test(maven) ? `"${maven}"` : maven
const args = ['-B', '-DskipTests', 'spring-boot:run']

console.log(`[e2e] Iniciando a API com ${maven} em ${backendDir}`)

const child = spawn(command, args, {
  cwd: backendDir,
  env: process.env,
  stdio: 'inherit',
  shell: isWindows,
})

let shuttingDown = false

function shutdown() {
  if (shuttingDown) return
  shuttingDown = true

  if (child.pid && isWindows) {
    spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
  } else if (child.pid) {
    child.kill('SIGTERM')
  }

  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

child.on('error', (error) => {
  console.error('[e2e] Não foi possível iniciar o Maven:', error.message)
  console.error(
    '[e2e] Instale o Maven no PATH ou defina DIGITACOURSE_MAVEN_HOME apontando para a pasta do Maven.',
  )
  process.exit(1)
})

child.on('exit', (code) => {
  if (!shuttingDown) process.exit(code ?? 1)
})
