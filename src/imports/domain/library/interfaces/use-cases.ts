import {Request, Response} from '../../base-types'

export interface QueryComicInfoByIdentityFromDatabaseUseCase {
  asyncExecute(request: Request): Promise<Response>
}

export interface QueryComicInfosFromDatabaseUseCase {
  asyncExecute(request?: Request): Promise<Response>
}

export interface UpdateComicInfoDatabaseUseCase {
  asyncExecute(): Promise<Response>
}
