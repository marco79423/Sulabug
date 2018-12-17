import {Entity} from '../../base-types'

export default class Config extends Entity {
  readonly downloadFolderPath: string
  readonly comicInfoDatabasePath: string

  constructor(
    comicsFolder: string,
    comicInfoDatabasePath: string,
  ) {
    super(null)
    this.downloadFolderPath = comicsFolder
    this.comicInfoDatabasePath = comicInfoDatabasePath
  }

  serialize() {
    return {
      downloadFolderPath: this.downloadFolderPath,
      comicInfoDatabasePath: this.comicInfoDatabasePath,
    }
  }
}
