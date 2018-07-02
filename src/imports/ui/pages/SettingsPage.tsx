import * as React from 'react'

import MainLayout from '../layouts/MainLayout'
import Settings from '../components/Settings'

interface PropsTypes {
}

export class SettingsPage extends React.Component<PropsTypes, {}> {
  render() {
    return (
      <MainLayout>
        <Settings/>
      </MainLayout>
    )
  }
}

export default SettingsPage
