import 'reflect-metadata'

import {Request, Response} from '../../base-types'
import {NetAdapter} from '../interfaces/adapters'
import DownloadBinaryUseCaseImpl from './DownloadBinaryUseCaseImpl'

describe('DownloadBinaryUseCaseImpl', () => {
  describe('asyncExecute', () => {
    it('will download binary data from network', async () => {
      const targetUrl = 'targetUrl'
      const targetPath = 'targetPath'

      const netAdapter: NetAdapter = {
        asyncGetText: jest.fn(),
        asyncDownload: jest.fn(),
        asyncGetBinaryBase64: jest.fn(),
      }
      const uc = new DownloadBinaryUseCaseImpl(netAdapter)
      const res = await uc.asyncExecute(new Request({
        targetUrl,
        targetPath,
      }))

      expect(netAdapter.asyncDownload).toBeCalledWith(targetUrl, targetPath)

      expect(res instanceof Response).toBeTruthy()
    })
  })
})
