import {Entity} from '../../base-types'

export default class Config extends Entity {
  readonly comicsFolder: string
  readonly comicInfoStorePath: string

  constructor(
    comicsFolder: string,
    comicInfoStorePath: string,
  ) {
    super(null)
    this.comicsFolder = comicsFolder
    this.comicInfoStorePath = comicInfoStorePath
  }

  serialize() {
    return {
      comicsFolder: this.comicsFolder,
      comicInfoStorePath: this.comicInfoStorePath,
    }
  }
}
