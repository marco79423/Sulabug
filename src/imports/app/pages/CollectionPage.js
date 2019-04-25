import * as React from 'react'
import {bindActionCreators, compose} from 'redux'
import {connect} from 'react-redux'

import {actions, selectors} from '../ducks/mainDuck'
import CollectionList from '../components/CollectionList'

class CollectionPage extends React.Component {
  render() {
    return (
      <CollectionList
        loading={this.props.loadingCollections || this.props.loadingComicInfos}
        collections={this.props.collections}
        comicInfos={this.props.comicInfos}

        removeComicFromCollection={this.props.removeComicFromCollection}
        openReadingPage={this.props.openReadingPage}
      />
    )
  }
}

export default compose(
  connect(
    state => ({
      loadingComicInfos: selectors.selectLoadingComicInfos(state),
      comicInfos: selectors.selectComicInfos(state),
      loadingCollections: selectors.selectLoadingCollections(state),
      collections: selectors.selectCollection(state),
    }),
    dispatch => bindActionCreators({
      removeComicFromCollection: actions.removeComicFromCollection,
      openReadingPage: actions.openReadingPage,
    }, dispatch)
  )
)(CollectionPage)
