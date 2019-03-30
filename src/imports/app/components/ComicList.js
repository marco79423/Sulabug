import * as React from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'
import List from '@material-ui/core/List'

import ComicListItem from './ComicListItem'

const styles = (theme) => createStyles({
  root: {
    padding: 0,
  },
})


export class ComicList extends React.Component {
  render() {
    const {classes, loading, comics, addComicToCollection} = this.props
    if (loading) {
      return <LinearProgress color="secondary" variant="query"/>
    }
    return (
      <List className={classes.root}>
        {comics.map((comic) => <ComicListItem key={comic.id} comic={comic} addComicToCollection={addComicToCollection}/>)}
      </List>
    )
  }
}

export default withStyles(styles)(ComicList)
