import {injectable} from 'inversify'

import UserProfile from '../entities/UserProfile'
import {IUserProfileFactory} from '../interfaces'

@injectable()
export default class UserProfileFactory implements IUserProfileFactory {
  createFromJson(json: {
    databaseUpdatedTime: string | null,
    downloadFolderPath: string,
  }): UserProfile {
    return new UserProfile(
      json.databaseUpdatedTime ? new Date(json.databaseUpdatedTime) : null,
      json.downloadFolderPath
    )
  }
}
