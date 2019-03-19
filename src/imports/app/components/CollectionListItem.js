import * as React from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import IconButton from '@material-ui/core/IconButton'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'

const styles = (theme) => createStyles({
  root: {},
  progress: {
    marginRight: theme.spacing.unit * 2
  }
})

export class CollectionListItem extends React.Component {

  render() {
    const {classes, collection, comicInfos} = this.props
    const comicInfo = comicInfos.filter(comicInfo => comicInfo.id === collection.comicInfoId)[0]

    return (
      <ListItem className={classes.root}>
        <ListItemAvatar>
          <Avatar>
            <img src={comicInfo.coverDataUrl}/>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={comicInfo.name}
        />
        <ListItemSecondaryAction>
          <IconButton onClick={() => {}}>
            <OpenInNewIcon/>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

export default withStyles(styles)(CollectionListItem)
