import * as React from 'react'
import {bindActionCreators, compose} from 'redux'
import {connect} from 'react-redux'

import {actions, selectors} from '../ducks/mainDuck'
import ComicList from '../components/ComicList'

class BrowsePage extends React.Component {

  render() {
    return (
      <ComicList
        sendAppStartSignal={this.props.sendAppStartSignal}
        loading={this.props.loadingComicInfos}
        comics={this.props.comicInfos}
        addComicToCollection={this.props.addComicToCollection}
      />
    )
  }
}

export default compose(
  connect(
    state => ({
      loadingComicInfos: selectors.selectLoadingComicInfos(state),
      comicInfos: selectors.selectComicInfos(state),
    }),
    dispatch => bindActionCreators({
      addComicToCollection: actions.addComicToCollection,
    }, dispatch)
  )
)(BrowsePage)
