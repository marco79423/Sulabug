export abstract class Entity {
  readonly identity: string

  protected constructor(identity) {
    this.identity = identity
  }

  abstract serialize()
}

export abstract class Event {

}

export class Request {
  public readonly data: any

  constructor(data: any) {
    this.data = data
  }
}

export class Response {
  public readonly data: any

  constructor(data?: any) {
    this.data = data
  }
}

export class ResponseError {
  public readonly reason: any

  constructor(reason: any) {
    this.reason = reason
  }
}

export interface AsyncUseCase {
  asyncExecute(request?: Request): Promise<Response | ResponseError>
}
