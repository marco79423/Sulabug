import {injectable} from 'inversify'

import CoverImage from '../entities/CoverImage'
import {CoverImageFactory} from '../interfaces/factories'

@injectable()
export default class CoverImageFactoryImpl implements CoverImageFactory {
  createFromJson(json: {
    id: string,
    comicInfoId: string,
    mediaType: string,
    base64Content: string,
  }): CoverImage {
    return new CoverImage(
      json.id,
      json.comicInfoId,
      json.mediaType,
      json.base64Content
    )
  }
}
