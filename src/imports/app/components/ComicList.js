import * as React from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import Divider from '@material-ui/core/Divider'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import dateFormat from 'dateformat'


import ComicListItem from './ComicListItem'

const styles = (theme) => createStyles({
  root: {
    padding: 0,
  },

  column: {
    flexBasis: '40%',
  },
})


export class ComicList extends React.Component {

  renderMetaSection = () => {
    const {classes, userProfile} = this.props

    const updatedTimeStr = userProfile.databaseUpdatedTime ? dateFormat(userProfile.databaseUpdatedTime, 'yyyy/mm/dd HH:MM') : '從未更新'

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <div className={classes.column}/>
          <div>
            <Typography inline>更新時間： {updatedTimeStr}</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            漫畫資料庫每天會自動更新一次，如果收藏的漫畫內容有更新會自動下載並通知。
          </Typography>
        </ExpansionPanelDetails>
        <Divider/>
        <ExpansionPanelActions>
          <Button variant="contained" onClick={this.props.updateComicDatabase}>手動更新資料庫</Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    )
  }

  render() {
    const {classes, loading, comics, collection, addComicToCollection} = this.props
    if (loading) {
      return <LinearProgress color="secondary" variant="query"/>
    }
    return (
      <>
        {this.renderMetaSection()}
        <List className={classes.root}>
          {comics.map((comic) => <ComicListItem key={comic.id} comic={comic} collection={collection}
                                                addComicToCollection={addComicToCollection}/>)}
        </List>
      </>
    )
  }
}

export default withStyles(styles)(ComicList)
