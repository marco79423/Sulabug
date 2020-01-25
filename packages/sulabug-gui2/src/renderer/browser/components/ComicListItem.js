import * as React from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'
import dateFormat from 'date-fns/format'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import CollectionsIcon from '@material-ui/icons/Collections'
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser'
import ListItem from '@material-ui/core/ListItem/ListItem'
import {useDispatch, useSelector} from 'react-redux'
import {addComicToCollectionsRequest} from '../ducks/actions'
import {getComicMap} from '../ducks/selectors'

const styles = (theme) => createStyles({
  root: {
    padding: theme.spacing(1),
    '&:not(:first-child)': {
      paddingTop: 0
    }
  },
  card: {
    display: 'flex',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
  },
  metadata: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',

    marginTop: theme.spacing(1),
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: 300,
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 120,
    height: 150,
  },
  summary: {
    marginTop: theme.spacing(1),
    height: 40,
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  openInBrowserIcon: {
    marginRight: theme.spacing(1),
  },
  collectionsIcon: {
    marginRight: theme.spacing(1),
  },
})

function ComicListItem({classes, comicId}) {
  const dispatch = useDispatch()
  const comicMap = useSelector(getComicMap)
  const comic = comicMap[comicId]

  const openInBrowser = () => {
    require('electron').shell.openExternal(comic.sourcePageUrl)
  }

  const addComicToCollections = () => dispatch(addComicToCollectionsRequest(comicId))

  return (
    <ListItem className={classes.root}>
      <Card className={classes.card}>
        <CardMedia
          className={classes.cover}
          image={comic.coverUrl}
          title={comic.name}
        />
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography className={classes.title} noWrap={true} variant="h2">{comic.name}</Typography>
            <Typography className={classes.metadata} variant="subtitle2" color="textSecondary">
              最新: {comic.lastUpdatedChapter} ({dateFormat(new Date(comic.lastUpdatedTime), 'yyyy/MM/dd')})
            </Typography>
            <Typography variant="subtitle2">{comic.summary.substring(0, 35)}...</Typography>
          </CardContent>
          <CardActions className={classes.actions}>
            <Button size="small" onClick={openInBrowser}><OpenInBrowserIcon
              className={classes.openInBrowserIcon}/><Typography variant="button">試看</Typography></Button>
            <Button size="small" variant="contained" color="primary" disabled={comic.inCollection}
                    onClick={addComicToCollections}><CollectionsIcon
              className={classes.collectionsIcon}/>{comic.inCollection ? '已收藏' : '收藏'}</Button>
          </CardActions>
        </div>
      </Card>
    </ListItem>
  )
}

export default withStyles(styles)(ComicListItem)
