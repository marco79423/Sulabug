import * as React from 'react'
import {useEffect} from 'react'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import dateformat from 'date-fns/format'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import {remote} from 'electron'
import DeleteIcon from '@material-ui/icons/Delete'
import {useDispatch, useSelector} from 'react-redux'
import {queryConfigRequest, removeComicFromCollectionsRequest} from '../ducks/actions'
import {getCollectionMap, getConfig} from '../ducks/selectors'

const useStyles = makeStyles(theme => ({
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
    position: 'relative'
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
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
  openReadingPageButton: {
    marginRight: theme.spacing(1),
  },
}))


export default function CollectionListItem({collectionId}) {
  const theme = useTheme()
  const classes = useStyles(theme)
  const dispatch = useDispatch()
  const collectionMap = useSelector(getCollectionMap)
  const collection = collectionMap[collectionId]
  const config = useSelector(getConfig)

  useEffect(() => {
    dispatch(queryConfigRequest())
  }, [dispatch])

  const openTargetFolder = () => {
    const {shell} = require('electron')
    shell.openItem(`${config.downloadDirPath}/${collection.name}`)
  }

  const remove = () => {
    remote.dialog.showMessageBox({
      type: 'warning',
      title: '警告',
      message: '移除收藏將會將本地端已經下載的漫畫刪除',
      cancelId: 1,
      buttons: ['刪除', '取消'],
    }, (index) => {
      if (index === 0) {
        dispatch(removeComicFromCollectionsRequest(collectionId))
      }
    })
  }

  return (
    <ListItem className={classes.root}>
      <Card className={classes.card}>
        <CardMedia
          className={classes.cover}
          image={collection.coverDataUrl}
          title={collection.name}
        />
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography className={classes.title} noWrap={true} variant="h2">{collection.name}</Typography>
            <Typography className={classes.metadata} variant="subtitle2" color="textSecondary">
              最新: {collection.lastUpdatedChapter} ({dateformat(new Date(collection.lastUpdatedTime), 'yyyy/MM/dd')})
            </Typography>
            <Typography variant="subtitle2">{collection.summary.substring(0, 35)}...</Typography>
          </CardContent>
          <CardActions className={classes.actions}>
            <Button size="small" onClick={remove}><DeleteIcon
              className={classes.openReadingPageButton}/>移除</Button>
            <Button size="small" variant="contained" color="primary" onClick={openTargetFolder}><OpenInNewIcon
              className={classes.openReadingPageButton}/>閱讀</Button>
          </CardActions>
        </div>
      </Card>
    </ListItem>
  )
}
