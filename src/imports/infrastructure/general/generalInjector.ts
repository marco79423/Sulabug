import {Container} from 'inversify'

import generalTypes from './generalTypes'
import {FileHandler, NetHandler} from './interfaces/bases'
import {SFSourceSite} from './interfaces/source-sites'
import FileHandlerImpl from './base/FileHandlerImpl'
import NetHandlerImpl from './base/NetHandlerImpl'
import {SFSourceSiteImpl} from './source-sites/SFSourceSiteImpl'

const generalInjector = new Container()

generalInjector.bind<FileHandler>(generalTypes.FileHandler).to(FileHandlerImpl).inSingletonScope()
generalInjector.bind<NetHandler>(generalTypes.NetHandler).to(NetHandlerImpl).inSingletonScope()

generalInjector.bind<SFSourceSite>(generalTypes.SFSourceSite).to(SFSourceSiteImpl).inSingletonScope()

export default generalInjector
