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
    marginRight: theme.spacing.unit * 2
  }
})

export class DownloadTaskListItem extends React.Component {

  renderProgress = () => {
    const {classes, downloadTask} = this.props
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

  deleteDownloadTask = () => {
    const {downloadTask} = this.props
    this.props.deleteDownloadTask(downloadTask.id)
  }

  render() {
    const {classes, downloadTask} = this.props
    return (
      <ListItem className={classes.root}>
        <ListItemAvatar>
          <Avatar>
            <img src={downloadTask.coverDataUrl}/>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={downloadTask.name}
          secondary={this.renderProgress()}
        />
      </ListItem>
    )
  }
}

export default withStyles(styles)(DownloadTaskListItem)
