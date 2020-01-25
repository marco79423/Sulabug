import * as React from 'react'
import {remote} from 'electron'
import {createStyles, withStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import FolderIcon from '@material-ui/icons/Folder'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'

import BaseLayout from '../layouts/BaseLayout'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect} from 'react'
import * as ducks from '../ducks'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'


const styles = (theme) => createStyles({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  textField: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(1),
    width: 180,
  },
})

function SettingsPage({classes}) {
  const dispatch = useDispatch()

  const loading = useSelector(ducks.isConfigLoading)
  const config = useSelector(ducks.getConfig)

  useEffect(() => {
    dispatch(ducks.queryConfigRequest())
  }, [dispatch])

  const updateComicsFolder = () => {
    const filePaths = remote.dialog.showOpenDialog({
      title: '指定漫畫資料夾',
      defaultPath: config.downloadDirPath,
      buttonLabel: '確定',
      properties: ['openDirectory', 'createDirectory', 'promptToCreate'],
    })
    if (filePaths && filePaths.length > 0) {
      dispatch(ducks.updateConfigRequest({
        ...config,
        downloadDirPath: filePaths[0],
      }))
    }
  }

  if (loading) {
    return (
      <BaseLayout>
        <LinearProgress color="secondary" variant="query"/>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout>
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
              secondary={config.downloadDirPath}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={updateComicsFolder}>
                <EditIcon/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </div>
    </BaseLayout>
  )
}

export default withStyles(styles)(SettingsPage)
