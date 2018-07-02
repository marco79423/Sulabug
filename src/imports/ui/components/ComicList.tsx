import * as React from 'react'
import {withStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import SaveIcon from '@material-ui/icons/Save'

const styles = theme => ({
  root: {
    width: '100%',
  },
  card: {
    display: 'flex',
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
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // paddingLeft: theme.spacing.unit,
    // paddingBottom: theme.spacing.unit,
  }
})

interface PropsTypes {
  classes: any,
}

export class ComicList extends React.Component<PropsTypes, {}> {
  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <List>
          <ListItem>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cover}
                image="http://rs.sfacg.com/web/novel/images/NovelCover/Small/2017/01/bfb9f16b-bcff-4604-95d3-435d629c20d2.jpg"
                title="Live from space album cover"
              />
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Typography variant="headline">Name</Typography>
                  <Typography variant="subheading" color="textSecondary">
                    Author | SF | Catalog | Status
                  </Typography>
                </CardContent>
                <div className={classes.controls}>
                  <IconButton aria-label="Next">
                    <SaveIcon/>
                  </IconButton>
                </div>
              </div>
            </Card>
          </ListItem>
          <ListItem>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cover}
                image="http://rs.sfacg.com/web/novel/images/NovelCover/Small/2017/01/bfb9f16b-bcff-4604-95d3-435d629c20d2.jpg"
                title="Live from space album cover"
              />
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Typography variant="headline">Name</Typography>
                  <Typography variant="subheading" color="textSecondary">
                    Author | SF | Catalog | Status
                  </Typography>
                </CardContent>
                <div className={classes.controls}>
                  <IconButton aria-label="Next">
                    <SaveIcon/>
                  </IconButton>
                </div>
              </div>
            </Card>
          </ListItem>
          <ListItem>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cover}
                image="http://rs.sfacg.com/web/novel/images/NovelCover/Small/2017/01/bfb9f16b-bcff-4604-95d3-435d629c20d2.jpg"
                title="Live from space album cover"
              />
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Typography variant="headline">Name</Typography>
                  <Typography variant="subheading" color="textSecondary">
                    Author | SF | Catalog | Status
                  </Typography>
                </CardContent>
                <div className={classes.controls}>
                  <IconButton aria-label="Next">
                    <SaveIcon/>
                  </IconButton>
                </div>
              </div>
            </Card>
          </ListItem>
        </List>
      </div>
    )
  }
}

export default withStyles(styles)(ComicList)
