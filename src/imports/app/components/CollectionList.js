import * as React from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import CollectionListItem from './CollectionListItem'
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

export class CollectionList extends React.Component {
  render() {
    const {classes, loading, collections, comicInfos} = this.props
    if (loading) {
      return <LinearProgress color="secondary" variant="query"/>
    }

    if (collections.length === 0) {
      return (
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h2" gutterBottom>報告老大！</Typography>
            <Typography variant="body1">沒有收藏的漫畫</Typography>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className={classes.root}>
        <List>
          {collections.map((collection) => <CollectionListItem key={collection.id}
                                                               collection={collection}
                                                               comicInfos={comicInfos}
                                                               deleteDownloadTask={this.props.deleteDownloadTask}/>)}
        </List>
      </div>
    )
  }
}

export default withStyles(styles)(CollectionList)
