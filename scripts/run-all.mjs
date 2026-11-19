import { spawnSync } from 'node:child_process'

const taskCount = 9

for (let taskNumber = 1; taskNumber <= taskCount; taskNumber += 1) {
  const title = `ЗАДАНИЕ ${taskNumber}`
  const border = '═'.repeat(18)

  console.log(`\n╔${border}╗`)
  console.log(`║ ${title.padEnd(16)} ║`)
  console.log(`╚${border}╝\n`)

  const result = spawnSync(process.execPath, [`dist/task${taskNumber}.js`], {
    stdio: 'inherit'
  })

  if (result.status !== 0) {
    console.error(`Задание ${taskNumber} завершилось с ошибкой.`)
    process.exit(result.status ?? 1)
  }
}

console.log('\nВсе девять заданий выполнены успешно.')
