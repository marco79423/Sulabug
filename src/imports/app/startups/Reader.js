import * as React from 'react'
import {bindActionCreators, compose} from 'redux'
import {connect} from 'react-redux'
import {Route} from 'react-router'

import ReadingPage from '../pages/ReadingPage'


class Reader extends React.Component {
  componentDidMount() {
    require('electron').ipcRenderer.on('comic-info-id-changed', (event, comicInfoId) => {
      this.props.history.push(`/reader/comics/${comicInfoId}`)
    })
  }

  render() {
    return (
      <Route exact path='/reader/comics/:comicInfoId' component={ReadingPage}/>
    )
  }
}

export default compose(
  connect(
    state => ({}),
    dispatch => bindActionCreators({}, dispatch)
  )
)(Reader)
