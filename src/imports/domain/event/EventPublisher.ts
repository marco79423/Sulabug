import {injectable} from 'inversify'

import {Subject} from 'rxjs'
import {Event} from '../base-types'

@injectable()
export default class EventPublisher {
  private readonly _eventStream = new Subject()

  getEventStream = () => {
    return this._eventStream
  }

  sendEvent = (event: Event) => {
    this._eventStream.next(event)
  }
}
