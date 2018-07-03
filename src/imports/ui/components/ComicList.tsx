import * as React from 'react'
import {withStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

import ComicListItem from './ComicListItem'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },

  listItem: {
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: theme.spacing.unit * 2,
  }
})

interface PropsTypes {
  classes: any,
}

export class ComicList extends React.Component<PropsTypes, {}> {
  render() {
    const {classes} = this.props
    return (
      <List className={classes.root}>
        <ListItem className={classes.listItem}>
          <ComicListItem/>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ComicListItem/>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ComicListItem/>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ComicListItem/>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ComicListItem/>
        </ListItem>
      </List>
    )
  }
}

export default withStyles(styles)(ComicList)
