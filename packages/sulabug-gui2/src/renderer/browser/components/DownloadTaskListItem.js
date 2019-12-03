import * as React from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import LinearProgress from '@material-ui/core/LinearProgress'
import Avatar from '@material-ui/core/Avatar'

const styles = (theme) => createStyles({
  root: {},
  progress: {
    marginRight: theme.spacing(2)
  }
})

function DownloadTaskListItem ({classes, downloadTask}) {

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

  const deleteDownloadTask = () => {
    // this.props.deleteDownloadTask(downloadTask.id)
  }

  return (
    <ListItem className={classes.root}>
      <ListItemAvatar>
        <Avatar>
          <img src={downloadTask.coverDataUrl}/>
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
