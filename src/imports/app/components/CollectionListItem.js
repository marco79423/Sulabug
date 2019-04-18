import * as React from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import dateformat from 'dateformat'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'

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
  openReadingPageButton: {
    marginRight: theme.spacing.unit,
  }
})

export class CollectionListItem extends React.Component {

  openReadingPage = () => {
    const {collection, comicInfos} = this.props
    const comicInfo = comicInfos.filter(comicInfo => comicInfo.id === collection.comicInfoId)[0]
    this.props.openReadingPage(comicInfo.id)
  }

  render() {
    const {classes, collection, comicInfos} = this.props
    const comicInfo = comicInfos.filter(comicInfo => comicInfo.id === collection.comicInfoId)[0]

    return (
      <ListItem className={classes.root}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.cover}
            image={comicInfo.coverDataUrl}
            title={comicInfo.name}
          />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography className={classes.title} noWrap={true} variant="h2">{comicInfo.name}</Typography>
              <Typography className={classes.metadata} variant="subtitle2" color="textSecondary">
                最新: {comicInfo.lastUpdatedChapter} ({dateformat(comicInfo.lastUpdatedTime, 'yyyy/mm/dd')})
              </Typography>
              <Typography variant="subtitle2">{comicInfo.summary.substring(0, 35)}...</Typography>
            </CardContent>
            <CardActions className={classes.actions}>
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
