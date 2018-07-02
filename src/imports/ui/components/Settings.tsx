import * as React from 'react'
import {withStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import FolderIcon from '@material-ui/icons/Folder'

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
            <Avatar>
              <FolderIcon/>
            </Avatar>
            <TextField
              id="target-folder"
              label="Target Folder"
              className={classes.textField}
              margin="normal"
            />
          </ListItem>
        </List>
      </div>
    )
  }
}

export default withStyles(styles)(Settings)
