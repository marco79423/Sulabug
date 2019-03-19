import 'reflect-metadata'

import {injectable} from 'inversify'
import {IComicFactory} from '../interfaces'
import Comic from '../entities/Comic'


@injectable()
export default class ComicFactory implements IComicFactory {

  createFromJson(json: {
    comicInfoIdentity: string,
  }): Comic {
    return new Comic(
      json.comicInfoIdentity,
      json.comicInfoIdentity,
    )
  }
}


