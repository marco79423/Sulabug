import * as React from 'react'
import {createStyles, Theme, withStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'

import ComicListItem from './ComicListItem'

const styles = (theme: Theme) => createStyles({
  root: {
    padding: 0,
  },
})

interface PropsTypes {
  classes: any,
  comics: any,
}

export class ComicList extends React.Component<PropsTypes, {}> {
  render() {
    const {classes, comics} = this.props

    return (
      <List className={classes.root}>
        {comics.map((comic: any) => <ComicListItem key={comic.id} comic={comic}/>)}
      </List>
    )
  }
}

export default withStyles(styles)(ComicList)
