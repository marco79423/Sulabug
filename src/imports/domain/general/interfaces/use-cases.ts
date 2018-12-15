import {Observable} from 'rxjs'

import {Request, Response} from '../../base-types'


export interface QueryConfigUseCase {
  execute(): Observable<Response>
}

export interface UpdateConfigUseCase {
  execute(request: Request): Observable<Response>
}
