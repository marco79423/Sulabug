import {Observable} from 'rxjs'

import {Request, Response} from '../../base-types'

export interface DeleteDownloadTaskUseCase{
  execute(request: Request): Observable<Response>
}

export interface DownloadComicUseCase{
  execute(request: Request): Observable<Response>
}
