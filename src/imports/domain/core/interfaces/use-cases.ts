import {Request, Response} from '../../base-types'

export interface QueryComicInfosFromDatabaseUseCase{
  asyncExecute(request?: Request): Promise<Response>
}

export interface QueryConfigUseCase{
  asyncExecute(): Promise<Response>
}

export interface UpdateComicInfoDatabaseUseCase{
  asyncExecute(): Promise<Response>
}

export interface UpdateConfigUseCase{
  asyncExecute(request: Request): Promise<Response>
}
