import {createGetCommandHandler, createSearchCommandHandler} from './binder/binder'
import * as commander from 'commander'

export function run() {
  const program = new commander.Command()

  // 下載
  program
    .command('get <漫畫名稱>')
    .option('-v, --verbose', '顯示詳細資訊')
    .action(async (comicName: string, cmd) => {
      const handler = createGetCommandHandler()
      await handler.handle(comicName, {verbose: cmd.verbose})
    })

  // 搜尋
  program
    .command('search <漫畫/作者>')
    .option('-v, --verbose', '顯示詳細資訊')
    .action(async (pattern: string, cmd) => {
      const handler = createSearchCommandHandler()
      await handler.handle(pattern, {verbose: cmd.verbose})
    })

  program.parse(process.argv)
}

run()