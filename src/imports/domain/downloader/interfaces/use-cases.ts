import {Request, Response} from '../../base-types'

export interface CreateDownloadTaskUseCase {
  asyncExecute(request: Request): Promise<Response>
}

export interface DeleteDownloadTaskUseCase{
  asyncExecute(request: Request): Promise<Response>
}

export interface DownloadComicUseCase{
  asyncExecute(request: Request): Promise<Response>
}

export interface QueryDownloadTasksUseCase{
  asyncExecute(): Promise<Response>
}
