import * as React from 'react'
import {createStyles, Theme, withStyles} from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ClearIcon from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import LinearProgress from '@material-ui/core/LinearProgress'
import Avatar from '@material-ui/core/Avatar'

const styles = (theme: Theme) => createStyles({
  root: {},
  progress: {
    marginRight: theme.spacing.unit * 2
  }
})

interface PropsTypes {
  classes: any
}

export class DownloadListItem extends React.Component<PropsTypes, {}> {
  render() {
    const {classes} = this.props
    return (
      <ListItem className={classes.root}>
        <ListItemAvatar>
          <Avatar>
            <img src={"http://rs.sfacg.com/web/novel/images/NovelCover/Small/2017/01/bfb9f16b-bcff-4604-95d3-435d629c20d2.jpg"}/>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Name"
          secondary={<LinearProgress className={classes.progress} variant="determinate" value={80}/>}
        />
        <ListItemSecondaryAction>
          <IconButton>
            <ClearIcon/>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

export default withStyles(styles)(DownloadListItem)
