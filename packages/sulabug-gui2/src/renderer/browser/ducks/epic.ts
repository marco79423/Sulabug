import {combineEpics, Epic, ofType} from 'redux-observable'
import {flatMap, map} from 'rxjs/operators'
import {merge, of} from 'rxjs'

import {ITaskStatus} from 'sulabug-core'
import {IDownloadTask} from './interface'
import * as actions from './actions'


export const handleDownloadTasksEpic: Epic = (action$, state$, {coreService}) => action$.pipe(
  ofType(
    actions.createDownloadTasksFromCollectionsSuccess.type,
  ),
  map(action => action.payload),
  flatMap((downloadTasks: IDownloadTask[]) => merge(...downloadTasks.map(downloadTask => of(downloadTask).pipe(
    flatMap(async downloadTask => {
      const comics = await coreService.searchComics({id: downloadTask.comicId, pattern: ''})
      if (comics.length !== 1) {
        throw new Error('unable to get target comic')
      }

      const config = await coreService.fetchConfig()
      const targetComic = comics[0]
      return [targetComic, config.downloadDirPath]
    }),
    flatMap(([targetComic, downloadDirPath]) => targetComic.startDownloadTask(downloadDirPath).pipe(map((downloadStatus: ITaskStatus) => actions.updateDownloadTaskStatus({
      comicId: targetComic.id,
      state: downloadStatus.completed ? 'Finished' : 'Downloading',
      progress: downloadStatus.progress.current / downloadStatus.progress.total * 100,
      status: downloadStatus.progress.status
    })))),
  )))),
)


export default combineEpics(
  handleDownloadTasksEpic
)
