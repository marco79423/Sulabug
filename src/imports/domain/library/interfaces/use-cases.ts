import {Observable} from 'rxjs'

import {Request, Response} from '../../base-types'

export interface QueryComicInfoByIdentityFromDatabaseUseCase {
  execute(request: Request): Observable<Response>
}
