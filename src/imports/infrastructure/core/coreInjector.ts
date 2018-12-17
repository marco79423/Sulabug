import {Container} from 'inversify'

import generalTypes from './coreTypes'
import {FileHandler, NetHandler} from './interfaces/bases'
import {SFSourceSite} from './interfaces/source-sites'
import FileHandlerImpl from './base/FileHandlerImpl'
import NetHandlerImpl from './base/NetHandlerImpl'
import {SFSourceSiteImpl} from './source-sites/SFSourceSiteImpl'

const coreInjector = new Container()

coreInjector.bind<FileHandler>(generalTypes.FileHandler).to(FileHandlerImpl).inSingletonScope()
coreInjector.bind<NetHandler>(generalTypes.NetHandler).to(NetHandlerImpl).inSingletonScope()

coreInjector.bind<SFSourceSite>(generalTypes.SFSourceSite).to(SFSourceSiteImpl).inSingletonScope()

export default coreInjector
