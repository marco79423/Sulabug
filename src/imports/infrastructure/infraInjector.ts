import {Container} from 'inversify'

import infraTypes from './infraTypes'
import {DBHandler, FileHandler, NetHandler} from './vendor/interfaces/handlers'
import {SFSourceSite} from './shared/interfaces/source-sites'
import FileHandlerImpl from './vendor/handlers/FileHandlerImpl'
import NetHandlerImpl from './vendor/handlers/NetHandlerImpl'
import SFSourceSiteImpl from './shared/source-sites/SFSourceSiteImpl'
import DBHandlerImpl from './vendor/handlers/DBHandlerImpl'
import Database from './shared/interfaces/Database'
import DatabaseImpl from './shared/database/DatabaseImpl'

const infraInjector = new Container()

infraInjector.bind<DBHandler>(infraTypes.DBHandler).to(DBHandlerImpl).inSingletonScope()
infraInjector.bind<FileHandler>(infraTypes.FileHandler).to(FileHandlerImpl).inSingletonScope()
infraInjector.bind<NetHandler>(infraTypes.NetHandler).to(NetHandlerImpl).inSingletonScope()

infraInjector.bind<Database>(infraTypes.Database).to(DatabaseImpl).inSingletonScope()
infraInjector.bind<SFSourceSite>(infraTypes.SFSourceSite).to(SFSourceSiteImpl).inSingletonScope()

export default infraInjector
