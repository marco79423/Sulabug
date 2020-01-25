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
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Divider from '@material-ui/core/Divider'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import Button from '@material-ui/core/Button'


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

  const createDownloadTasksFromCollections = () => dispatch(ducks.createDownloadTasksFromCollectionsRequest())

  return (
    <BaseLayout>
      <div className={classes.root}>
        {/*Meta Section*/}
        <ExpansionPanel className={classes.meta}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <div>
              <Typography inline>更新時間： </Typography>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography variant="body2">
              收藏的漫畫每天都會自動下載更新。
            </Typography>
          </ExpansionPanelDetails>
          <Divider/>
          <ExpansionPanelActions>
            <Button variant="contained" onClick={createDownloadTasksFromCollections}>手動下載</Button>
          </ExpansionPanelActions>
        </ExpansionPanel>
        <List>
          {collectionIds.map(collectionId => <CollectionListItem key={collectionId} collectionId={collectionId}/>)}
        </List>
      </div>
    </BaseLayout>
  )
}

export default withStyles(styles)(CollectionPage)
