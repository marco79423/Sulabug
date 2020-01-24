import * as React from 'react'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {createStyles, withStyles} from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import {Link} from 'react-router-dom'
import List from '@material-ui/core/List'

import * as ducks from '../ducks'
import BaseLayout from '../layouts/BaseLayout'
import CollectionListItem from '../components/CollectionListItem'


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
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  }
})


export function CollectionPage({classes}) {
  const dispatch = useDispatch()
  const collectionIds = useSelector(ducks.getCollectionIds)
  const loading = useSelector(ducks.isCollectionsLoading)

  useEffect(() => {
    dispatch(ducks.queryCollectionsRequest())
  }, [dispatch])

  if (loading) {
    return (
      <BaseLayout>
        <LinearProgress color="secondary" variant="query"/>
      </BaseLayout>
    )
  }

  if (collectionIds.length === 0) {
    return (
      <BaseLayout pageLoading={loading}>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h2" gutterBottom>您的收藏是空的！</Typography>
            <Typography classes={{body1: classes.body}} variant="body1">您可以在 <Link className={classes.link}
                                                                                   to="/browser/browse">瀏覽漫畫</Link> 選擇要收藏的漫畫</Typography>
          </CardContent>
        </Card>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout>
      <div className={classes.root}>
        <List>
          {collectionIds.map(collectionId => <CollectionListItem key={collectionId} collectionId={collectionId}/>)}
        </List>
      </div>
    </BaseLayout>
  )
}

export default withStyles(styles)(CollectionPage)
