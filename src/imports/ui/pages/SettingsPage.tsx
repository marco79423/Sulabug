import * as React from 'react'
import {Button} from '@material-ui/core'

import MainLayout from '../layouts/MainLayout'

interface PropsTypes {
}

export class SettingsPage extends React.Component<PropsTypes, {}> {
  render() {
    return (
      <MainLayout>
        <Button variant='contained' color='primary'>
          Hello SettingsPage
        </Button>
      </MainLayout>
    )
  }
}

export default SettingsPage
