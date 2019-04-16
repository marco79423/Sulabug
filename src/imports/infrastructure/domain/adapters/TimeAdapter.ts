import {injectable} from 'inversify'
import {ITimeAdapter} from '../../../domain/interfaces'

@injectable()
export default class TimeAdapter implements ITimeAdapter {

  getNow(): Date {
    return new Date()
  }
}
