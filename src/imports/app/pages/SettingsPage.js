import * as React from 'react'
import {bindActionCreators, compose} from 'redux'
import {connect} from 'react-redux'

import {actions, selectors} from '../ducks/mainDuck'
import BaseLayout from '../layouts/BaseLayout'
import Settings from '../components/Settings'

class SettingsPage extends React.Component {
  render() {
    return (
      <BaseLayout searchComic={this.props.searchComic}>
        <Settings
          updateUserProfile={this.props.updateUserProfile}
          userProfile={this.props.userProfile}
        />
      </BaseLayout>
    )
  }
}

export default compose(
  connect(
    state => ({
      userProfile: selectors.selectUserProfile(state),
    }),
    dispatch => bindActionCreators({
      updateUserProfile: actions.updateUserProfile,
    }, dispatch)
  )
)(SettingsPage)
