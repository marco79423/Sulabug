import {Entity} from '../base-types'

export default class Chapter extends Entity {
  readonly order: number
  readonly name: string
  readonly sourcePageUrl: string

  constructor(
    id: string,
    order: number,
    name: string,
    sourcePageUrl: string,
  ) {
    super(id)
    this.order = order
    this.name = name
    this.sourcePageUrl = sourcePageUrl
  }

  serialize() {
    return {
      id: this.id,
      order: this.order,
      name: this.name,
      sourcePageUrl: this.sourcePageUrl,
    }
  }
}
