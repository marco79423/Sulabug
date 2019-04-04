import * as React from 'react'
import {bindActionCreators, compose} from 'redux'
import {connect} from 'react-redux'

import {actions, selectors} from '../ducks/mainDuck'
import BaseLayout from '../layouts/BaseLayout'
import CollectionList from '../components/CollectionList'

class CollectionPage extends React.Component {
  render() {
    return (
      <BaseLayout searchComic={this.props.searchComic}>
        <CollectionList
          loading={this.props.loadingCollections || this.props.loadingComicInfos}
          collections={this.props.collections}
          comicInfos={this.props.comicInfos}

          openReadingPage={this.props.openReadingPage}
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
      loadingCollections: selectors.selectLoadingCollections(state),
      collections: selectors.selectCollection(state),
    }),
    dispatch => bindActionCreators({
      openReadingPage: actions.openReadingPage,
    }, dispatch)
  )
)(CollectionPage)