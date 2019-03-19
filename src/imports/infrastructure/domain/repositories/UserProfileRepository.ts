import {inject, injectable} from 'inversify'
import UserProfile from '../../../domain/entities/UserProfile'
import types from '../../../domain/types'
import {IUserProfileFactory} from '../../../domain/interfaces'
import {IUserProfileRepository} from '../../../domain/interfaces'
import infraTypes from '../../infraTypes'
import IDatabase from '../../shared/interfaces'
import {UserProfileCollection} from '../../shared/database/collections'

@injectable()
export default class UserProfileRepository implements IUserProfileRepository {
  readonly defaultUserProfileData = {
    downloadFolderPath: './comics',
  }

  private readonly _userProfileFactory: IUserProfileFactory
  private readonly _database: IDatabase

  public constructor(
    @inject(types.UserProfileFactory) userProfileFactory: IUserProfileFactory,
    @inject(infraTypes.Database) database: IDatabase,
  ) {
    this._userProfileFactory = userProfileFactory
    this._database = database
  }

  asyncSaveOrUpdate = async (userProfile: UserProfile): Promise<void> => {
    await this._database.asyncSaveOrUpdate(UserProfileCollection.name, {
      id: 'default',
      ...userProfile.serialize(),
    })
  }

  asyncGet = async (): Promise<UserProfile> => {
    let userProfileData = await this._database.asyncFindOne(UserProfileCollection.name)
    if (!userProfileData) {
      await this._database.asyncSaveOrUpdate(UserProfileCollection.name, {
        id: 'default',
        ...this.defaultUserProfileData,
      })
      userProfileData = this.defaultUserProfileData
    }
    return this._userProfileFactory.createFromJson(userProfileData)
  }
}
