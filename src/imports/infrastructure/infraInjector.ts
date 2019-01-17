import {Container} from 'inversify'

import infraTypes from './infraTypes'
import {IDBHandler, IFileHandler, INetHandler} from './vendor/interfaces'
import {ISFSourceSite} from './shared/interfaces'
import FileHandler from './vendor/handlers/FileHandler'
import NetHandler from './vendor/handlers/NetHandler'
import SFSourceSite from './shared/source-sites/SFSourceSite'
import DBHandler from './vendor/handlers/DBHandler'
import IDatabase from './shared/interfaces'
import Database from './shared/database/Database'

const infraInjector = new Container()

infraInjector.bind<IDBHandler>(infraTypes.DBHandler).to(DBHandler).inSingletonScope()
infraInjector.bind<IFileHandler>(infraTypes.FileHandler).to(FileHandler).inSingletonScope()
infraInjector.bind<INetHandler>(infraTypes.NetHandler).to(NetHandler).inSingletonScope()

infraInjector.bind<IDatabase>(infraTypes.Database).to(Database).inSingletonScope()
infraInjector.bind<ISFSourceSite>(infraTypes.SFSourceSite).to(SFSourceSite).inSingletonScope()

export default infraInjector
