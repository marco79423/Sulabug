import {Observable} from 'rxjs'

import {Request, Response} from '../../base-types'

export interface UpdateConfigUseCase {
  execute(request: Request): Observable<Response>
}
