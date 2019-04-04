import * as React from 'react'
import {bindActionCreators, compose} from 'redux'
import {connect} from 'react-redux'

import {actions, selectors} from '../ducks/mainDuck'
import ComicList from '../components/ComicList'
import BaseLayout from '../layouts/BaseLayout'

class BrowsePage extends React.Component {
  componentDidMount() {
    this.props.sendAppStartSignal()
  }

  render() {
    return (
      <BaseLayout searchComic={this.props.searchComic}>
        <ComicList
          sendAppStartSignal={this.props.sendAppStartSignal}
          loading={this.props.loadingComicInfos}
          comics={this.props.comicInfos}
          addComicToCollection={this.props.addComicToCollection}
        />
      </BaseLayout>
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
      sendAppStartSignal: actions.sendAppStartSignal,
      searchComic: actions.searchComic,
      addComicToCollection: actions.addComicToCollection,
    }, dispatch)
  )
)(BrowsePage)
