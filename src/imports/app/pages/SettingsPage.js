import * as React from 'react'
import {bindActionCreators, compose} from 'redux'
import {connect} from 'react-redux'

import {actions, selectors} from '../ducks/mainDuck'
import Settings from '../components/Settings'

class SettingsPage extends React.Component {
  render() {
    return (
      <Settings
        updateUserProfile={this.props.updateUserProfile}
        userProfile={this.props.userProfile}
      />
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
