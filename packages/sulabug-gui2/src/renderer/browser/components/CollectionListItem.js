import * as React from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'
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
    marginTop: theme.spacing.unit,
    height: 40,
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  openReadingPageButton: {
    marginRight: theme.spacing.unit,
  }
})

export class CollectionListItem extends React.Component {

  openReadingPage() {
    const {comic} = this.props
    this.props.openReadingPage(comic.id)
  }

  remove () {
    const {comic} = this.props
    remote.dialog.showMessageBox({
      type: 'warning',
      title: '警告',
      message: '移除收藏將會將本地端已經下載的漫畫刪除',
      cancelId: 1,
      buttons: ['刪除', '取消'],
    }, (index) => {
      if (index === 0) {
        this.props.removeComicFromCollection(comic.id)
      }
    })
  }

  render() {
    const {classes, comic} = this.props

    return (
      <ListItem className={classes.root}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.cover}
            image={comic.coverDataUrl}
            title={comic.name}
          />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography className={classes.title} noWrap={true} variant="h2">{comic.name}</Typography>
              <Typography className={classes.metadata} variant="subtitle2" color="textSecondary">
                最新: {comic.lastUpdatedChapter} ({dateformat(comic.lastUpdatedTime, 'yyyy/MM/dd')})
              </Typography>
              <Typography variant="subtitle2">{comic.summary.substring(0, 35)}...</Typography>
            </CardContent>
            <CardActions className={classes.actions}>
              <Button size="small" onClick={this.remove}><DeleteIcon className={classes.openReadingPageButton}/>移除</Button>
              <Button size="small" variant="contained" color="primary" onClick={this.openReadingPage}><OpenInNewIcon
                className={classes.openReadingPageButton}/>閱讀</Button>
            </CardActions>
          </div>
        </Card>
      </ListItem>
    )
  }
}

export default withStyles(styles)(CollectionListItem)
