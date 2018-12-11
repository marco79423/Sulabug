import {Container} from 'inversify'

import generalTypes from './generalTypes'
import {FileHandler, NetHandler} from './interfaces/bases'
import FileHandlerImpl from './base/FileHandlerImpl'
import NetHandlerImpl from './base/NetHandlerImpl'

const generalInjector = new Container()

generalInjector.bind<FileHandler>(generalTypes.FileHandler).to(FileHandlerImpl).inSingletonScope()
generalInjector.bind<NetHandler>(generalTypes.NetHandler).to(NetHandlerImpl).inSingletonScope()

export default generalInjector
