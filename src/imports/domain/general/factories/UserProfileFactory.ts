import {injectable} from 'inversify'

import UserProfile from '../entities/UserProfile'
import {IUserProfileFactory} from '../interfaces'

@injectable()
export default class UserProfileFactory implements IUserProfileFactory {

  createFromJson(json: {
    downloadFolderPath: string,
  }): UserProfile {
    return new UserProfile(
      json.downloadFolderPath,
    )
  }
}
