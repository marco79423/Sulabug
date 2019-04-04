import * as React from 'react'
import {bindActionCreators, compose} from 'redux'
import {connect} from 'react-redux'

import {actions, selectors} from '../ducks/mainDuck'
import BaseLayout from '../layouts/BaseLayout'
import DownloadTaskList from '../components/DownloadTaskList'

class DownloadPage extends React.Component {
  render() {
    return (
      <BaseLayout searchComic={this.props.searchComic}>
        <DownloadTaskList
          loading={this.props.loadingDownloadTasks}
          downloadTasks={this.props.downloadTasks}
        />
      </BaseLayout>
    )
  }
}

export default compose(
  connect(
    state => ({
      loadingDownloadTasks: selectors.selectLoadingDownloadTaskInfos(state),
      downloadTasks: selectors.selectDownloadTasks(state),
    }),
    dispatch => bindActionCreators({
      searchComic: actions.searchComic,
    }, dispatch)
  )
)(DownloadPage)
