export abstract class Entity {
  readonly id: string

  protected constructor(id) {
    this.id = id
  }

  abstract serialize()
}

export abstract class Event {

}
