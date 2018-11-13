import * as React from 'react'
import {createStyles, Theme, withStyles} from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ClearIcon from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import LinearProgress from '@material-ui/core/LinearProgress'
import Avatar from '@material-ui/core/Avatar'

const styles = (theme: Theme) => createStyles({
  root: {},
  progress: {
    marginRight: theme.spacing.unit * 2
  }
})

interface PropsTypes {
  classes: any,
  downloadTask: any,
}

export class DownloadTaskListItem extends React.Component<PropsTypes, {}> {

  renderProgress = () => {
    const {classes, downloadTask} = this.props
    switch (downloadTask.status) {
      case 'downloading':
        return <LinearProgress className={classes.progress} variant="determinate" value={downloadTask.progress}/>
      case 'preparing':
        return <LinearProgress className={classes.progress} variant="query"/>
      default:
        return null
    }
  }

  render() {
    const {classes, downloadTask} = this.props
    return (
      <ListItem className={classes.root}>
        <ListItemAvatar>
          <Avatar>
            <img src={downloadTask.coverUrl}/>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Name"
          secondary={this.renderProgress()}
        />
        <ListItemSecondaryAction>
          <IconButton>
            <ClearIcon/>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

export default withStyles(styles)(DownloadTaskListItem)
