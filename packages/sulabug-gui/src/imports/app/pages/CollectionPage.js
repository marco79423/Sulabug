import * as React from 'react'
import {bindActionCreators, compose} from 'redux'
import {connect} from 'react-redux'

import {actions, selectors} from '../ducks/mainDuck'
import CollectionList from '../components/CollectionList'

class CollectionPage extends React.Component {
  render() {
    return (
      <CollectionList
        loading={this.props.loadingCollection}
        comics={this.props.comics}

        removeComicFromCollection={this.props.removeComicFromCollection}
        openReadingPage={this.props.openReadingPage}
      />
    )
  }
}

export default compose(
  connect(
    state => ({
      loadingCollection: selectors.selectLoadingCollection(state),
      comics: selectors.selectCollection(state),
    }),
    dispatch => bindActionCreators({
      removeComicFromCollection: actions.removeComicFromCollection,
      openReadingPage: actions.openReadingPage,
    }, dispatch)
  )
)(CollectionPage)
