import {Entity} from '../../base-types'

export default class CoverImage extends Entity {
  readonly comicInfoIdentity: string
  readonly mediaType: string
  readonly base64Content: string

  constructor(
    identity: string,
    comicInfoIdentity: string,
    mediaType: string,
    base64Content: string,
  ) {
    super(identity)
    this.comicInfoIdentity = comicInfoIdentity
    this.mediaType = mediaType
    this.base64Content = base64Content
  }

  serialize(): {} {
    return {
      id: this.identity,
      comicInfoId: this.comicInfoIdentity,
      mediaType: this.mediaType,
      base64Content: this.base64Content,
    }
  }
}
