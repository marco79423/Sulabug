import * as commander from 'commander'
import {createConfigCommandHandler, createGetCommandHandler, createSearchCommandHandler} from './command'

export function run() {
  const program = new commander.Command()

  // 下載
  program
    .command('get <漫畫名稱>')
    .option('-u, --update', '強制更新漫畫資料庫')
    .option('-v, --verbose', '顯示詳細資訊')
    .action(async (comicName: string, cmd) => {
      const handler = createGetCommandHandler()
      await handler.handle(comicName, {
        update: cmd.update,
        verbose: cmd.verbose,
      })
    })

  // 搜尋
  program
    .command('search <漫畫/作者>')
    .option('-u, --update', '強制更新漫畫資料庫')
    .option('-v, --verbose', '顯示詳細資訊')
    .action(async (pattern: string, cmd) => {
      const handler = createSearchCommandHandler()
      await handler.handle(pattern, {
        update: cmd.update,
        verbose: cmd.verbose,
      })
    })

  // 設定
  program
    .command('config <屬性> <值>')
    .action(async (attrName: string, attrValue: string) => {
      const handler = createConfigCommandHandler()
      await handler.handle(attrName, attrValue)
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
