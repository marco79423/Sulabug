import 'reflect-metadata'
import IDatabase from '../../shared/interfaces'
import {UserProfileCollection} from '../../shared/database/collections'
import UserProfileFactory from '../../../domain/factories/UserProfileFactory'
import UserProfileRepository from './UserProfileRepository'


describe('UserProfileRepository', () => {
  describe('asyncSaveOrUpdate', () => {
    it('will save or update the target userProfile into repository', async () => {
      const userProfileFactory = new UserProfileFactory()
      const userProfile = userProfileFactory.createFromJson({
        downloadFolderPath: 'downloadFolderPath',
      })

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(),
      }

      const userProfileRepository = new UserProfileRepository(
        userProfileFactory,
        database
      )

      await userProfileRepository.asyncSaveOrUpdate(userProfile)

      expect(database.asyncSaveOrUpdate).toBeCalledWith(UserProfileCollection.name, {
        id: 'default',
        ...userProfile.serialize(),
      })
    })
  })

  describe('asyncGet', () => {
    it('will get userProfile from repository', async () => {
      const userProfileFactory = new UserProfileFactory()
      const userProfile = userProfileFactory.createFromJson({
        downloadFolderPath: 'downloadFolderPath',
      })

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(() => userProfile.serialize()),
      }

      const userProfileRepository = new UserProfileRepository(
        userProfileFactory,
        database
      )

      const result = await userProfileRepository.asyncGet()

      expect(database.asyncFindOne).toBeCalledWith(UserProfileCollection.name)
      expect(result.serialize()).toEqual(userProfile.serialize())
    })

    it('will insert default userProfile before get userProfile from repository', async () => {
      const userProfileFactory = new UserProfileFactory()

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(() => null),
      }

      const userProfileRepository = new UserProfileRepository(
        userProfileFactory,
        database
      )

      const result = await userProfileRepository.asyncGet()

      expect(database.asyncFindOne).toBeCalledWith(UserProfileCollection.name)
      expect(database.asyncSaveOrUpdate).toBeCalledWith(UserProfileCollection.name, {
        id: 'default',
        ...userProfileRepository.defaultUserProfileData,
      })

      expect(result.serialize()).toEqual(userProfileRepository.defaultUserProfileData)
    })
  })
})

