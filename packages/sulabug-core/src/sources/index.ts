import {IWebComicSource} from '../interface'
import {DumpWebComicSource} from './dump'
import {SFWebComicSource} from './sfacg'

export function createDumpWebComicSource(): IWebComicSource {
  return new DumpWebComicSource()
}

export function createSFWebComicSource(): IWebComicSource {
  return new SFWebComicSource()
}