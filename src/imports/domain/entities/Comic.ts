import {Entity} from '../base-types'


export default class Comic extends Entity {
  public readonly comicInfoIdentity: string

  constructor(
    identity: string,
    comicInfoIdentity: string,
  ) {
    super(identity)
    this.comicInfoIdentity = comicInfoIdentity
  }

  serialize() {
    return {
      id: this.identity,
      comicInfoId: this.comicInfoIdentity,
    }
  }
}
