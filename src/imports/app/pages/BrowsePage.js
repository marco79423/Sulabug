import * as React from 'react'
import {bindActionCreators, compose} from 'redux'
import {connect} from 'react-redux'

import {actions, selectors} from '../ducks/mainDuck'
import ComicList from '../components/ComicList'

class BrowsePage extends React.Component {

  render() {
    return (
      <ComicList
        loading={this.props.loading}
        userProfile={this.props.userProfile}
        comics={this.props.comicInfos}
        collection={this.props.collection}
        updateComicInfoDatabase={this.props.updateComicInfoDatabase}
        addComicToCollection={this.props.addComicToCollection}
      />
    )
  }
}

export default compose(
  connect(
    state => ({
      loading:  selectors.selectLoadingUserProfile(state) || selectors.selectLoadingComicInfos(state) || selectors.selectLoadingCollection(state),
      userProfile: selectors.selectUserProfile(state),
      comicInfos: selectors.selectComicInfos(state),
      collection: selectors.selectCollection(state),
    }),
    dispatch => bindActionCreators({
      updateComicInfoDatabase: actions.updateComicInfoDatabase,
      addComicToCollection: actions.addComicToCollection,
    }, dispatch)
  )
)(BrowsePage)
