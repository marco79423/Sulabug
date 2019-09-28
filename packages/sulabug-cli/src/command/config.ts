import {ICoreService} from '../service/core'

export interface IConfigCommandHandler {
  handle(attrName: string, attrValue: string): Promise<void>
}

export class ConfigCommandHandler implements IConfigCommandHandler {
  private readonly _coreService: ICoreService

  constructor(coreService: ICoreService) {
    this._coreService = coreService
  }

  async handle(attrName: string, attrValue: string): Promise<void> {
    await this._coreService.updateConfig(attrName, attrValue)
  }
}
