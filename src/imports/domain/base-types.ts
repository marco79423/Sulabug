export abstract class Entity {
  readonly identity: string

  protected constructor(identity) {
    this.identity = identity
  }

  abstract serialize()
}

export abstract class Event {

}
