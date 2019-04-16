import {Entity} from '../base-types'

export default class UserProfile extends Entity {
  readonly databaseUpdatedTime: Date | null
  readonly downloadFolderPath: string

  constructor(
    databaseUpdatedTime: Date | null,
    downloadFolderPath: string,
  ) {
    super(null)
    this.databaseUpdatedTime = databaseUpdatedTime
    this.downloadFolderPath = downloadFolderPath
  }

  serialize() {
    return {
      databaseUpdatedTime: this.databaseUpdatedTime !== null ? this.databaseUpdatedTime.toISOString() : null,
      downloadFolderPath: this.downloadFolderPath,
    }
  }
}
