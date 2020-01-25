import * as React from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import LinearProgress from '@material-ui/core/LinearProgress'
import Avatar from '@material-ui/core/Avatar'
import {useDispatch, useSelector} from 'react-redux'
import * as ducks from '../ducks'

const styles = (theme) => createStyles({
  root: {},
  progress: {
    marginRight: theme.spacing(2)
  }
})

function DownloadTaskListItem ({classes, downloadTaskId}) {
  const dispatch = useDispatch()
  const downloadTaskMap = useSelector(ducks.getDownloadTaskMap)
  const downloadTask = downloadTaskMap[downloadTaskId]


  const renderProgress = () => {
    switch (downloadTask.status) {
      case 'PREPARING':
        return <LinearProgress className={classes.progress} variant="query"/>
      case 'DOWNLOADING':
      case 'FINISHED':
        return <LinearProgress className={classes.progress} variant="determinate" value={downloadTask.progress}/>
      default:
        return null
    }
  }

  return (
    <ListItem className={classes.root}>
      <ListItemAvatar>
        <Avatar>
          <img src={downloadTask.coverUrl}/>
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={downloadTask.name}
        secondary={renderProgress()}
      />
    </ListItem>
  )
}

export default withStyles(styles)(DownloadTaskListItem)
