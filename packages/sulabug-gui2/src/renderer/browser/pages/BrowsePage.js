import * as React from 'react'
import {useEffect} from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'
import {useDispatch, useSelector} from 'react-redux'
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
import dateFormat from 'date-fns/format'

import * as ducks from '../ducks'
import ComicListItem from '../components/ComicListItem'
import BaseLayout from '../layouts/BaseLayout'


const styles = (theme) => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },

  meta: {
    flex: '0 0 auto',
    zIndex: 1,
  },

  listWrapper: {
    flex: '1 1 auto',

    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },

  list: {
    padding: 0,
  },

  column: {
    flexBasis: '40%',
  },
})

export function BrowsePage({classes}) {
  const dispatch = useDispatch()

  const updateComicDatabase = () => {}

  useEffect(() => {
    dispatch(ducks.queryComicsRequest())
  }, [dispatch])

  const loading = useSelector(ducks.isComicsLoading)
  const comicIds = useSelector(ducks.getComicIds)

  if (loading) {
    return (
      <BaseLayout>
        <LinearProgress color="secondary" variant="query"/>
      </BaseLayout>
    )
  }

  const updatedTime = new Date()
  const updatedTimeStr = updatedTime ? dateFormat(updatedTime, 'yyyy/MM/dd HH:mm') : '從未更新'

  return (
    <BaseLayout>
      <div className={classes.root}>
        {/*Meta Section*/}
        <ExpansionPanel className={classes.meta}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <div className={classes.column}/>
            <div>
              <Typography inline>更新時間： {updatedTimeStr}</Typography>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography variant="body2">
              漫畫資料庫每天會自動更新一次，如果收藏的漫畫內容有更新會自動下載並通知。
            </Typography>
          </ExpansionPanelDetails>
          <Divider/>
          <ExpansionPanelActions>
            <Button variant="contained" onClick={updateComicDatabase}>手動更新資料庫</Button>
          </ExpansionPanelActions>
        </ExpansionPanel>

        {/*List Section*/}
        <div className={classes.listWrapper}>
          <List className={classes.list}>
            {comicIds.map((comicId) => <ComicListItem key={comicId} comicId={comicId}/>)}
          </List>
        </div>
      </div>
    </BaseLayout>
  )
}

export default withStyles(styles)(BrowsePage)
