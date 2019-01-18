import UserProfile from './entities/UserProfile'

export interface IUserProfileFactory {
  createFromJson(json: {
    downloadFolderPath: string,
  }): UserProfile
}

export interface IUserProfileRepository {

  asyncSaveOrUpdate(userProfile: UserProfile): Promise<void>

  asyncGet(): Promise<UserProfile>
}
