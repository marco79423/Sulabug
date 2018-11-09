import * as React from 'react'
import {createStyles, Theme, withStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'

import DownloadListItem from './DownloadListItem'

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
  },
  progress: {
    marginRight: theme.spacing.unit * 2
  }
})

interface PropsTypes {
  classes: any
}

export class DownloadList extends React.Component<PropsTypes, {}> {
  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <List>
          <DownloadListItem/>
        </List>
      </div>
    )
  }
}

export default withStyles(styles)(DownloadList)
