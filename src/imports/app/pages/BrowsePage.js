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
        comics={this.props.comics}
        collection={this.props.collection}
        updateComicDatabase={this.props.updateComicDatabase}
        addComicToCollection={this.props.addComicToCollection}
      />
    )
  }
}

export default compose(
  connect(
    state => ({
      loading:  selectors.selectLoadingUserProfile(state) || selectors.selectLoadingComics(state) || selectors.selectLoadingCollection(state),
      userProfile: selectors.selectUserProfile(state),
      comics: selectors.selectComics(state),
      collection: selectors.selectCollection(state),
    }),
    dispatch => bindActionCreators({
      updateComicDatabase: actions.updateComicDatabase,
      addComicToCollection: actions.addComicToCollection,
    }, dispatch)
  )
)(BrowsePage)
