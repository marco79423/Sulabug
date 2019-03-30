import * as React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Route, Switch} from 'react-router'

import {actions, selectors} from '../ducks/mainDuck'
import BaseLayout from '../layouts/BaseLayout'
import ComicList from '../components/ComicList'
import DownloadTaskList from '../components/DownloadTaskList'
import Settings from '../components/Settings'
import CollectionList from '../components/CollectionList'

export class Main extends React.Component {

  renderBrowsePage = () => {
    return (
      <ComicList
        loading={this.props.loadingComicInfos}
        comics={this.props.comicInfos}
        addComicToCollection={this.props.addComicToCollection}
      />
    )
  }

  renderCollectionPage = () => {
    return <CollectionList
      loading={this.props.loadingCollections || this.props.loadingComicInfos}
      collections={this.props.collections}
      comicInfos={this.props.comicInfos}

      deleteDownloadTask={this.props.deleteDownloadTask}
    />
  }

  renderDownloadPage = () => {
    return (
      <DownloadTaskList
        loading={this.props.loadingDownloadTasks}
        downloadTasks={this.props.downloadTasks}

        deleteDownloadTask={this.props.deleteDownloadTask}
      />
    )
  }

  renderSettingsPage = () => {
    return (
      <Settings
        updateUserProfile={this.props.updateUserProfile}
        userProfile={this.props.userProfile}
      />
    )
  }

  componentDidMount() {
    this.props.sendAppStartSignal()
  }

  render() {
    return (
      <BaseLayout searchComic={this.props.searchComic}>
        <Switch>
          <Route exact path="/" render={this.renderBrowsePage}/>
          <Route exact path="/collection" render={this.renderCollectionPage}/>
          <Route exact path="/download" render={this.renderDownloadPage}/>
          <Route exact path="/settings" render={this.renderSettingsPage}/>
        </Switch>
      </BaseLayout>
    )
  }
}

export default connect(
  state => ({
    loadingComicInfos: selectors.selectLoadingComicInfos(state),
    comicInfos: selectors.selectComicInfos(state),
    loadingCollections: selectors.selectLoadingCollections(state),
    collections: selectors.selectCollection(state),
    loadingDownloadTasks: selectors.selectLoadingDownloadTaskInfos(state),
    downloadTasks: selectors.selectDownloadTasks(state),
    userProfile: selectors.selectUserProfile(state),
  }),
  dispatch => bindActionCreators({
    sendAppStartSignal: actions.sendAppStartSignal,
    searchComic: actions.searchComic,
    addComicToCollection: actions.addComicToCollection,
    createDownloadTask: actions.createDownloadTask,
    deleteDownloadTask: actions.deleteDownloadTask,
    updateUserProfile: actions.updateUserProfile,
  }, dispatch)
)(Main)
