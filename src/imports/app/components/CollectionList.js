import * as React from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import {Link} from 'react-router-dom'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'

import CollectionListItem from './CollectionListItem'


const styles = (theme) => createStyles({
  card: {
    margin: theme.spacing.unit * 2,
  },
  root: {
    padding: 0,
  },
  body: {
    marginTop: theme.spacing.unit * 3,
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
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
            <Typography variant="h2" gutterBottom>您的收藏是空的！</Typography>
            <Typography classes={{body1: classes.body}} variant="body1">您可以在 <Link className={classes.link}
                                                                                   to="/main/browse">瀏覽漫畫</Link> 選擇要收藏的漫畫</Typography>
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
                                                               openReadingPage={this.props.openReadingPage}/>)}
        </List>
      </div>
    )
  }
}

export default withStyles(styles)(CollectionList)
