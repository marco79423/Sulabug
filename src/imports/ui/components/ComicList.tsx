import * as React from 'react'
import {withStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'

import ComicListItem from './ComicListItem'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
})

interface PropsTypes {
  classes: any,
}

export class ComicList extends React.Component<PropsTypes, {}> {
  render() {
    const {classes} = this.props
    return (
      <List className={classes.root}>
        <ComicListItem/>
        <ComicListItem/>
        <ComicListItem/>
        <ComicListItem/>
        <ComicListItem/>
      </List>
    )
  }
}

export default withStyles(styles)(ComicList)
