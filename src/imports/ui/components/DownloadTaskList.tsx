import * as React from 'react'
import {createStyles, Theme, withStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'

import DownloadTaskListItem from './DownloadTaskListItem'

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
  },
  progress: {
    marginRight: theme.spacing.unit * 2
  }
})

interface PropsTypes {
  classes: any,
  downloadTasks: any,
}

export class DownloadTaskList extends React.Component<PropsTypes, {}> {
  render() {
    const {classes, downloadTasks} = this.props
    return (
      <div className={classes.root}>
        <List>
          {downloadTasks.map((downloadTask: any) => <DownloadTaskListItem key={downloadTask.id} downloadTask={downloadTask}/>)}
        </List>
      </div>
    )
  }
}

export default withStyles(styles)(DownloadTaskList)
