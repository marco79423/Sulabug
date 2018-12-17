import {Observable} from 'rxjs'

import {Request, Response} from '../../base-types'

export interface CreateDownloadTaskUseCase {
  execute(request: Request): Observable<Response>
}

export interface DeleteDownloadTaskUseCase{
  execute(request: Request): Observable<Response>
}

export interface DownloadComicUseCase{
  execute(request: Request): Observable<Response>
}

export interface QueryDownloadTasksUseCase{
  execute(): Observable<Response>
}
