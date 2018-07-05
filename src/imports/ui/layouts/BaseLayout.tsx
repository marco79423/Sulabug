import * as React from 'react'
import classNames from 'classnames'
import {withStyles} from '@material-ui/core/styles'
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
import CssBaseline from '@material-ui/core/CssBaseline'
import {Link} from 'react-router-dom'

import 'typeface-roboto/index.css'

import SearchBar from '../components/SearchBar'

interface PropsTypes {
  classes: any,
  theme: any,
}


const drawerWidth = 240

const styles = (theme: any) => ({
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
    paddingRight: theme.spacing.unit * 2,
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
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
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
  },
  topContentSpacer: {
    ...theme.mixins.toolbar,
  },
  content: {
    flex: '1 300px',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }
})


class BaseLayout extends React.Component<PropsTypes, {}> {
  state = {
    open: false,
  }

  handleDrawerOpen = () => {
    this.setState({open: true})
  }

  handleDrawerClose = () => {
    this.setState({open: false})
  }

  render() {
    const {classes, theme} = this.props

    return (
      <React.Fragment>
        <CssBaseline/>
        <div className={classes.root}>
          <AppBar
            position='absolute'
            className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
          >
            <Toolbar disableGutters={!this.state.open}>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, this.state.open && classes.hide)}
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
              paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
            }}
            open={this.state.open}
          >
            <div className={classes.toolbar}>
              <IconButton onClick={this.handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
              </IconButton>
            </div>
            <Divider/>
            <List>
              <ListItem button component={Link} to="/">
                <ListItemIcon>
                  <ExploreIcon/>
                </ListItemIcon>
                <ListItemText primary="瀏覽漫畫"/>
              </ListItem>
              <ListItem button component={Link} to="/download">
                <ListItemIcon>
                  <MoveToInboxIcon/>
                </ListItemIcon>
                <ListItemText primary="我的下載"/>
              </ListItem>
            </List>
            <Divider/>
            <List>
              <ListItem button component={Link} to="/settings">
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
              {this.props.children}
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}


export default withStyles(styles, {withTheme: true})(BaseLayout)