import * as React from 'react'
import {bindActionCreators, compose} from 'redux'
import {connect} from 'react-redux'

import {actions} from '../ducks/mainDuck'
import BaseLayout from '../layouts/BaseLayout'
import {Route} from 'react-router'
import CollectionPage from '../pages/CollectionPage'
import DownloadPage from '../pages/DownloadPage'
import SettingsPage from '../pages/SettingsPage'
import BrowsePage from '../pages/BrowsePage'

class Main extends React.Component {
  componentDidMount() {
    this.props.sendAppStartSignal()
  }

  render() {
    return (
      <BaseLayout searchComic={this.props.searchComic}>
        <Route exact path='/main/browse' component={BrowsePage}/>
        <Route exact path='/main/collection' component={CollectionPage}/>
        <Route exact path='/main/download' component={DownloadPage}/>
        <Route exact path='/main/settings' component={SettingsPage}/>
      </BaseLayout>
    )
  }
}

export default compose(
  connect(
    state => ({}),
    dispatch => bindActionCreators({
      sendAppStartSignal: actions.sendAppStartSignal,
      searchComic: actions.searchComic,
    }, dispatch)
  )
)(Main)
