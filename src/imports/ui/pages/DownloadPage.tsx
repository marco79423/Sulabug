import * as React from 'react'
import {Button} from '@material-ui/core'

import MainLayout from '../layouts/MainLayout'

interface PropsTypes {
}

export class DownloadPage extends React.Component<PropsTypes, {}> {
  render() {
    return (
      <MainLayout>
        <Button variant='contained' color='primary'>
          Hello DownloadPage
        </Button>
      </MainLayout>
    )
  }
}

export default DownloadPage
