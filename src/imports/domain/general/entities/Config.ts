import {Entity} from '../../base-types'

export default class Config extends Entity {
  readonly downloadFolderPath: string

  constructor(
    comicsFolder: string,
  ) {
    super(null)
    this.downloadFolderPath = comicsFolder
  }

  serialize() {
    return {
      downloadFolderPath: this.downloadFolderPath,
    }
  }
}
