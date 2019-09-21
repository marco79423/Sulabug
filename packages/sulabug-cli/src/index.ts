import * as commander from 'commander'
import {createGetCommandHandler, createSearchCommandHandler} from './command'

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

  program
    .on('command:*', () => {
      console.error('我太笨，看不懂您的指令 %s，可以試試 --help 了解一下我能看懂啥。', program.args.join(' '))
      process.exit(1)
    })

  program.parse(process.argv)

  if (process.argv.length === 2) {
    program.help()
  }
}

run()
