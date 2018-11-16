import * as React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {actions, Page, selectors} from '../ducks/mainDuck'
import BaseLayout from '../layouts/BaseLayout'
import ComicList from '../components/ComicList'
import DownloadTaskList from '../components/DownloadTaskList'
import Settings from '../components/Settings'

export class Main extends React.Component {

  renderCurrentPage = () => {
    switch (this.props.currentPage) {
      case Page.BROWSE_PAGE:
        return this.renderBrowsePage()
      case Page.DOWNLOAD_PAGE:
        return this.renderDownloadPage()
      case Page.SETTINGS_PAGE:
        return this.renderSettingsPage()
      default:
        return this.renderBrowsePage()
    }
  }

  renderBrowsePage = () => {
    return (
      <ComicList
        loading={this.props.loadingComicInfos}
        comics={this.props.comicInfos}
        createDownloadTask={this.props.createDownloadTask}
      />
    )
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
        updateConfig={this.props.updateConfig}
        config={this.props.config}
      />
    )
  }

  render() {
    return (
      <BaseLayout
        searchComic={this.props.searchComic}
        changeCurrentPage={this.props.changeCurrentPage}
      >
        {this.renderCurrentPage()}
      </BaseLayout>
    )
  }
}

export default connect(
  state => ({
    currentPage: selectors.selectCurrentPage(state),
    loadingComicInfos: selectors.selectLoadingComicInfos(state),
    comicInfos: selectors.selectComicInfos(state),
    loadingDownloadTasks: selectors.selectLoadingDownloadTaskInfos(state),
    downloadTasks: selectors.selectDownloadTaskInfos(state),
    config: selectors.selectConfig(state),
  }),
  dispatch => bindActionCreators({
    changeCurrentPage: actions.changeCurrentPage,
    searchComic: actions.searchComic,
    createDownloadTask: actions.createDownloadTask,
    deleteDownloadTask: actions.deleteDownloadTask,
    updateConfig: actions.updateConfig,
  }, dispatch)
)(Main)
