import * as React from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import DownloadTaskListItem from './DownloadTaskListItem'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'

const styles = (theme) => createStyles({
  card: {
    margin: theme.spacing.unit * 2,
  },
  root: {
    padding: 0,
  },
  progress: {
    marginRight: theme.spacing.unit * 2
  }
})

export class DownloadTaskList extends React.Component {
  render() {
    const {classes, loading, downloadTasks} = this.props
    if (loading) {
      return <LinearProgress color="secondary" variant="query"/>
    }

    if (downloadTasks.length === 0) {
      return (
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h2" gutterBottom>報告老大！</Typography>
            <Typography variant="body1">沒有正在下載的任務！</Typography>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className={classes.root}>
        <List>
          {downloadTasks.map((downloadTask) => <DownloadTaskListItem key={downloadTask.id}
                                                                     downloadTask={downloadTask}
                                                                     deleteDownloadTask={this.props.deleteDownloadTask}/>)}
        </List>
      </div>
    )
  }
}

export default withStyles(styles)(DownloadTaskList)
