import {Entity} from '../../base-types'

export default class Chapter extends Entity {
  readonly order: number
  readonly name: string
  readonly sourcePageUrl: string

  constructor(
    identity: string,
    order: number,
    name: string,
    sourcePageUrl: string,
  ) {
    super(identity)
    this.order = order
    this.name = name
    this.sourcePageUrl = sourcePageUrl
  }

  serialize() {
    return {
      id: this.identity,
      order: this.order,
      name: this.name,
      sourcePageUrl: this.sourcePageUrl,
    }
  }
}
