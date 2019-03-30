import {Entity} from '../base-types'

export default class UserProfile extends Entity {
  readonly downloadFolderPath: string

  constructor(
    downloadFolderPath: string,
  ) {
    super(null)
    this.downloadFolderPath = downloadFolderPath
  }

  serialize() {
    return {
      downloadFolderPath: this.downloadFolderPath,
    }
  }
}
