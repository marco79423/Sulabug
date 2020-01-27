import React, {useState} from 'react'
import classNames from 'classnames'
import {Link} from 'react-router-dom'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox'
import ExploreIcon from '@material-ui/icons/Explore'
import SettingsIcon from '@material-ui/icons/Settings'
import CollectionsIcon from '@material-ui/icons/Collections'
import CssBaseline from '@material-ui/core/CssBaseline'

import 'typeface-roboto/index.css'

import SearchBar from '../components/SearchBar'


const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  SearchBarWrapper: {
    flex: 1,
    paddingRight: theme.spacing(2),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  main: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,

    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  topContentSpacer: {
    ...theme.mixins.toolbar,
  },
  content: {
    height: '100%',
  }
}))

export default function BaseLayout({children}) {
  const theme = useTheme()
  const classes = useStyles(theme)
  const [isOpen, setOpen] = useState(false)

  const handleDrawerOpen = () => setOpen(true)
  const handleDrawerClose = () => setOpen(false)

  return (
    <React.Fragment>
      <CssBaseline/>
      <div className={classes.root}>
        <AppBar
          position='absolute'
          className={classNames(classes.appBar, isOpen && classes.appBarShift)}
        >
          <Toolbar disableGutters={!isOpen}>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              className={classNames(classes.menuButton, isOpen && classes.hide)}
            >
              <MenuIcon/>
            </IconButton>
            <div className={classes.SearchBarWrapper}>
              <SearchBar/>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          variant='permanent'
          classes={{
            paper: classNames(classes.drawerPaper, !isOpen && classes.drawerPaperClose),
          }}
          open={isOpen}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
            </IconButton>
          </div>
          <Divider/>
          <List>
            <ListItem button component={Link} to="/browser/collection">
              <ListItemIcon>
                <CollectionsIcon/>
              </ListItemIcon>
              <ListItemText primary="我的收藏"/>
            </ListItem>
            <ListItem button component={Link} to="/browser/browse">
              <ListItemIcon>
                <ExploreIcon/>
              </ListItemIcon>
              <ListItemText primary="瀏覽漫畫"/>
            </ListItem>
            <ListItem button component={Link} to="/browser/download">
              <ListItemIcon>
                <MoveToInboxIcon/>
              </ListItemIcon>
              <ListItemText primary="下載狀態"/>
            </ListItem>
          </List>
          <Divider/>
          <List>
            <ListItem button component={Link} to="/browser/settings">
              <ListItemIcon>
                <SettingsIcon/>
              </ListItemIcon>
              <ListItemText primary="個人設定"/>
            </ListItem>
          </List>
        </Drawer>
        <div className={classes.main}>
          <div className={classes.topContentSpacer}/>
          <div className={classes.content}>
            {children}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
