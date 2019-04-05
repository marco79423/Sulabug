import * as React from 'react'
import {bindActionCreators, compose} from 'redux'
import {connect} from 'react-redux'

import {actions, selectors} from '../ducks/mainDuck'
import DownloadTaskList from '../components/DownloadTaskList'

class DownloadPage extends React.Component {
  render() {
    return (
      <DownloadTaskList
        loading={this.props.loadingDownloadTasks}
        downloadTasks={this.props.downloadTasks}
      />
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
    }, dispatch)
  )
)(DownloadPage)
