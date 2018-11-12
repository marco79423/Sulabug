import * as React from 'react'
import {createStyles, Theme, withStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import ListItem from '@material-ui/core/ListItem/ListItem'


const styles = (theme: Theme) => createStyles({
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
  source: {
    marginLeft: theme.spacing.unit
  },
  subtitle: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 120,
    height: 150,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  saveIcon: {
    marginRight: theme.spacing.unit,
  },
})

interface PropsTypes {
  classes: any,
  comic: any,
}

export class ComicListItem extends React.Component<PropsTypes, {}> {
  render() {
    const {classes, comic} = this.props
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
              <div className={classes.title}>
                <Typography variant="h5">{comic.name}</Typography>
                <Typography className={classes.source} variant="body2">[{comic.source}]</Typography>
              </div>
              <Typography className={classes.subtitle} variant="body1" color="textSecondary">
                {comic.author} | {comic.catalog} | {comic.lastUpdated}
              </Typography>
            </CardContent>
            <CardActions className={classes.actions}>
              <Button size="small"><SaveIcon className={classes.saveIcon}/> 下載</Button>
            </CardActions>
          </div>
        </Card>
      </ListItem>
    )
  }
}

export default withStyles(styles)(ComicListItem)
