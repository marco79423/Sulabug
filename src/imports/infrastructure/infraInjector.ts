import {Container} from 'inversify'

import generalTypes from './infraTypes'
import {FileHandler, NetHandler} from './vendor/interfaces/handlers'
import {SFSourceSite} from './shared/interfaces/source-sites'
import FileHandlerImpl from './vendor/handlers/FileHandlerImpl'
import NetHandlerImpl from './vendor/handlers/NetHandlerImpl'
import {SFSourceSiteImpl} from './shared/source-sites/SFSourceSiteImpl'

const infraInjector = new Container()

infraInjector.bind<FileHandler>(generalTypes.FileHandler).to(FileHandlerImpl).inSingletonScope()
infraInjector.bind<NetHandler>(generalTypes.NetHandler).to(NetHandlerImpl).inSingletonScope()

infraInjector.bind<SFSourceSite>(generalTypes.SFSourceSite).to(SFSourceSiteImpl).inSingletonScope()

export default infraInjector
