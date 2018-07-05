import * as React from 'react'
import {withStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import FolderIcon from '@material-ui/icons/Folder'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
  },
  textField: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit,
    width: 180,
  },
})

interface PropsTypes {
  classes: any
}

export class Settings extends React.Component<PropsTypes, {}> {
  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <FolderIcon/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="漫畫下載目錄"
              secondary='C:/Comics'
            />
            <ListItemSecondaryAction>
              <IconButton>
                <EditIcon/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </div>
    )
  }
}

export default withStyles(styles)(Settings)
