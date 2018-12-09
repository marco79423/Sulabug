import 'reflect-metadata'

import {Request, Response} from '../../base-types'
import {NetAdapter} from '../interfaces/adapters'
import FetchHtmlUseCaseImpl from './FetchHtmlUseCaseImpl'

describe('FetchHtmlUseCaseImpl', () => {
  describe('asyncExecute', () => {
    it('will fetch html text from network', async () => {
      const targetUrl = 'targetUrl'
      const targetHtmlContent = 'targetHtmlContent'

      const netAdapter: NetAdapter = {
        asyncGetText: jest.fn(() => Promise.resolve(targetHtmlContent)),
        asyncDownload: jest.fn(),
        asyncGetBinaryBase64: jest.fn(),
      }
      const uc = new FetchHtmlUseCaseImpl(netAdapter)
      const res = await uc.asyncExecute(new Request(targetUrl))

      expect(netAdapter.asyncGetText).toBeCalledWith(targetUrl)

      expect(res instanceof Response).toBeTruthy()
      expect((res as Response).data).toBe(targetHtmlContent)
    })
  })
})
