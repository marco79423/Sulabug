import {Container} from 'inversify'

import infraTypes from './infraTypes'
import {IDBHandler, IFileHandler, INetHandler} from './vendor/interfaces'
import {ISFSourceSite} from './shared/interfaces'
import FileHandlerImpl from './vendor/handlers/FileHandlerImpl'
import NetHandlerImpl from './vendor/handlers/NetHandlerImpl'
import SFSourceSiteImpl from './shared/source-sites/SFSourceSiteImpl'
import DBHandlerImpl from './vendor/handlers/DBHandlerImpl'
import IDatabase from './shared/interfaces'
import DatabaseImpl from './shared/database/DatabaseImpl'

const infraInjector = new Container()

infraInjector.bind<IDBHandler>(infraTypes.DBHandler).to(DBHandlerImpl).inSingletonScope()
infraInjector.bind<IFileHandler>(infraTypes.FileHandler).to(FileHandlerImpl).inSingletonScope()
infraInjector.bind<INetHandler>(infraTypes.NetHandler).to(NetHandlerImpl).inSingletonScope()

infraInjector.bind<IDatabase>(infraTypes.Database).to(DatabaseImpl).inSingletonScope()
infraInjector.bind<ISFSourceSite>(infraTypes.SFSourceSite).to(SFSourceSiteImpl).inSingletonScope()

export default infraInjector
