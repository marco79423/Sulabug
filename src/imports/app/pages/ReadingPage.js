import * as React from 'react'
import classNames from 'classnames'
import {createStyles, withStyles} from '@material-ui/core/styles'
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
import ListItemText from '@material-ui/core/ListItemText'
import CssBaseline from '@material-ui/core/CssBaseline'
import {bindActionCreators, compose} from 'redux'
import {connect} from 'react-redux'

import 'typeface-roboto/index.css'

import {actions, selectors} from '../ducks/mainDuck'

const drawerWidth = 240

const styles = (theme) => createStyles({
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
    height: '100vh',
  },
  topContentSpacer: {
    ...theme.mixins.toolbar,
  },
  content: {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }
})


class ReadingPage extends React.Component {
  state = {
    open: true,
    chapterIdx: 0,
    comicId: null,
    comicImages: [],
  }

  handleDrawerOpen = () => {
    this.setState({open: true})
  }

  handleDrawerClose = () => {
    this.setState({open: false})
  }

  changeChapterIdx = (chapterIdx) => {
    this.setState({chapterIdx})
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.params.comicId !== prevState.comicId) {
      nextProps.loadComicImagesFromCollection(nextProps.match.params.comicId)
      return {
        comicId: nextProps.match.params.comicId,
      }
    }

    if (nextProps.comicImages !== prevState.comicImages) {
      return {
        chapterIdx: 0,
        comicImages: nextProps.comicImages,
      }
    }
    return null
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
              {this.state.comicImages.map((comicImage, idx) => (
                <ListItem key={comicImage.name} button onClick={() => this.changeChapterIdx(idx)}>
                  <ListItemText primary={comicImage.name}/>
                </ListItem>
              ))}
            </List>
          </Drawer>
          <div className={classes.main}>
            <div className={classes.topContentSpacer}/>
            <div className={classes.content}>
              {this.state.comicImages.length > 0 && this.state.comicImages[this.state.chapterIdx].images.map((image, idx) => (
                <div key={idx}>
                  <img src={`file://${image}`}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default compose(
  withStyles(styles, {withTheme: true}),
  connect(
    state => ({
      comicImages: selectors.selectComicImages(state),
    }),
    dispatch => bindActionCreators({
      loadComicImagesFromCollection: actions.loadComicImagesFromCollection,
    }, dispatch)
  )
)(ReadingPage)
