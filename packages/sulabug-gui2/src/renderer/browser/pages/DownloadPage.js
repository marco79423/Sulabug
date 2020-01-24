import * as React from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'

import BaseLayout from '../layouts/BaseLayout'
import DownloadTaskListItem from '../components/DownloadTaskListItem'


const styles = (theme) => createStyles({
  card: {
    margin: theme.spacing(2),
  },
  root: {
    padding: 0,
  },
  body: {
    marginTop: theme.spacing(3),
  },
  progress: {
    marginRight: theme.spacing(2)
  }
})


function DownloadPage({classes}) {
  const downloadTasks = []
  const loading = false

  if (loading) {
    return (
      <BaseLayout>
        <LinearProgress color="secondary" variant="query"/>
      </BaseLayout>
    )
  }

  if (downloadTasks.length === 0) {
    return (
      <BaseLayout>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h2" gutterBottom>報告老大！</Typography>
            <Typography classes={{body1: classes.body}} variant="body1">沒有正在下載的任務！</Typography>
          </CardContent>
        </Card>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout>
      <div className={classes.root}>
        <List>
          {downloadTasks.map((downloadTask) => <DownloadTaskListItem key={downloadTask.id}
                                                                     downloadTask={downloadTask}
                                                                     deleteDownloadTask={this.props.deleteDownloadTask}/>)}
        </List>
      </div>
    </BaseLayout>
  )
}

export default withStyles(styles)(DownloadPage)