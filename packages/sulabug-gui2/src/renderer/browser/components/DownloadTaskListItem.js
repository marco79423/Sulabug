import React from 'react'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import LinearProgress from '@material-ui/core/LinearProgress'
import Avatar from '@material-ui/core/Avatar'
import {useSelector} from 'react-redux'
import {getComicMap, getDownloadTaskMap} from '../ducks/selectors'


const useStyles = makeStyles(theme => ({
  root: {},
  progress: {
    marginRight: theme.spacing(2)
  }
}))

export default function DownloadTaskListItem({downloadTaskId}) {
  const theme = useTheme()
  const classes = useStyles(theme)

  const downloadTaskMap = useSelector(getDownloadTaskMap)
  const comicMap = useSelector(getComicMap)
  const downloadTask = downloadTaskMap[downloadTaskId]
  const targetComic = comicMap[downloadTask.comicId]

  const renderProgress = () => {
    switch (downloadTask.state) {
      case 'Pending':
        return <LinearProgress className={classes.progress} variant="query"/>
      case 'Downloading':
      case 'Finished':
        return <LinearProgress className={classes.progress} variant="determinate" value={downloadTask.progress}/>
      default:
        return null
    }
  }

  return (
    <ListItem className={classes.root}>
      <ListItemAvatar>
        <Avatar>
          <img src={targetComic.coverUrl}/>
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={targetComic.name}
        secondary={renderProgress()}
      />
    </ListItem>
  )
}
