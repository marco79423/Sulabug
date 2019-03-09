import UserProfile from './entities/UserProfile'

export interface IUserProfileFactory {
  createFromJson(json: {
    downloadFolderPath: string,
  }): UserProfile
}

export interface IFileService {

  asyncEnsureDir(targetDirPath: string): Promise<void>

  asyncReadJson(targetPath: string, defaultJson: any): Promise<any>

  asyncWriteJson(targetPath: string, data: any): Promise<void>

  asyncPathExists(targetPath: string): Promise<boolean>
}

export interface INetService {

  asyncGetText(targetUrl: string): Promise<string>

  asyncDownload(targetUrl: string, targetPath: string): Promise<void>

  asyncGetBinaryBase64(targetUrl: string): Promise<string>
}

export interface IUserProfileRepository {

  asyncSaveOrUpdate(userProfile: UserProfile): Promise<void>

  asyncGet(): Promise<UserProfile>
}

export interface IFileAdapter {

  asyncEnsureDir(targetDirPath: string): Promise<void>

  asyncReadJson(targetPath: string, defaultJson: any): Promise<any>

  asyncWriteJson(targetPath: string, data: any): Promise<void>

  asyncPathExists(targetPath: string): Promise<boolean>
}

export interface INetAdapter {

  asyncGetText(targetUrl: string): Promise<string>

  asyncDownload(targetUrl: string, targetPath: string): Promise<void>

  asyncGetBinaryBase64(targetUrl: string): Promise<string>
}