import * as React from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import FolderIcon from '@material-ui/icons/Folder'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import {remote} from 'electron'

const styles = (theme) => createStyles({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  textField: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit,
    width: 180,
  },
})

export class Settings extends React.Component {
  updateComicsFolder = () => {
    const {userProfile, updateUserProfile} = this.props
    const filePaths = remote.dialog.showOpenDialog({
      title: '指定漫畫資料夾',
      defaultPath: userProfile.downloadFolderPath,
      buttonLabel: '確定',
      properties: ['openDirectory', 'createDirectory', 'promptToCreate'],
    })
    if (filePaths.length > 0) {
      updateUserProfile({
        ...userProfile,
        downloadFolderPath: filePaths[0],
      })
    }
  }

  render() {
    const {classes, userProfile} = this.props
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
              secondary={userProfile.downloadFolderPath}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={this.updateComicsFolder}>
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
