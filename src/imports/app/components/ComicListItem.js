import * as React from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'
import dateformat from 'dateformat'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import ListItem from '@material-ui/core/ListItem/ListItem'


const styles = (theme) => createStyles({
  root: {
    padding: theme.spacing.unit,
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

    marginTop: theme.spacing.unit,
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
    marginTop: theme.spacing.unit,
    height: 40,
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  saveIcon: {
    marginRight: theme.spacing.unit,
  },
})

export class ComicListItem extends React.Component {

  createDownloadTask = () => {
    const {comic} = this.props
    this.props.createDownloadTask(comic.id)
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
                最新: {comic.lastUpdatedChapter} ({dateformat(comic.lastUpdatedTime, 'yyyy/mm/dd')})
              </Typography>
            </CardContent>
            <CardActions className={classes.actions}>
              <Button size="small" onClick={this.createDownloadTask}><SaveIcon className={classes.saveIcon}/><Typography variant="button">下載</Typography></Button>
            </CardActions>
          </div>
        </Card>
      </ListItem>
    )
  }
}

export default withStyles(styles)(ComicListItem)
