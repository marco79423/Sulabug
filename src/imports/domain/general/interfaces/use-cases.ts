import {Request, Response} from '../../base-types'


export interface QueryConfigUseCase {
  asyncExecute(): Promise<Response>
}

export interface UpdateConfigUseCase {
  asyncExecute(request: Request): Promise<Response>
}
