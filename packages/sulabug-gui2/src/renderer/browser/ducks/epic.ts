import {combineEpics, Epic, ofType} from 'redux-observable'
import {flatMap, map, tap} from 'rxjs/operators'
import {concat, of} from 'rxjs'

import {ITaskStatus} from 'sulabug-core'
import * as actions from './actions'


export const handleDownloadTasksEpic: Epic = (action$, state$, {coreService}) => action$.pipe(
  ofType(
    actions.handleDownloadTaskRequest.type,
  ),
  tap(() => console.log('啟動下載任務 ...')),
  map(action => action.payload),
  flatMap(downloadTask => concat(
    of(actions.handleDownloadTaskProcessing({
      ...downloadTask,
      state: 'Downloading',
    })),
    of(downloadTask).pipe(
      flatMap(async downloadTask => {
        const config = await coreService.fetchConfig()
        const downloadDirPath = config.downloadDirPath
        console.log(`取得下載路徑： ${downloadDirPath}`)

        const comics = await coreService.searchComics({id: downloadTask.comicId, pattern: ''})
        if (comics.length !== 1) {
          throw new Error('unable to get target comic')
        }
        const targetComic = comics[0]
        return [targetComic, downloadDirPath]
      }),
      flatMap(([targetComic, downloadDirPath]) => {
        targetComic.startDownloadTask = targetComic.startDownloadTask.bind(targetComic)

        return targetComic.startDownloadTask(downloadDirPath).pipe(map((downloadStatus: ITaskStatus) => actions.handleDownloadTaskProcessing({
          ...downloadTask,
          state: downloadStatus.completed ? 'Finished' : 'Downloading',
          progress: downloadStatus.progress.current / downloadStatus.progress.total * 100,
          status: downloadStatus.progress.status
        })))
      }),
    ),
    concat(
      of(actions.updateConfigProcessing()),
      of(1).pipe(
        flatMap(async () => {
          try {
            const profile = await coreService.fetchConfig()
            const newProfile = {
              ...profile,
              lastDownloadTime: new Date()
            }
            await coreService.updateConfig(newProfile)
            return actions.updateConfigSuccess(newProfile)
          } catch (e) {
            return actions.updateConfigFailure(e)
          }
        })
      ),
    ),
    of(actions.handleDownloadTaskSuccess()),
  ))
)


export default combineEpics(
  handleDownloadTasksEpic
)
