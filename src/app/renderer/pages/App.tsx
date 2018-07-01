import * as React from 'react'
import {Button} from '@material-ui/core'

import MainLayout from '../layouts/MainLayout'

interface PropsTypes {
}

export class App extends React.Component<PropsTypes, {}> {
  render() {
    return (
      <MainLayout>
        <Button variant='contained' color='primary'>
          Hello World
        </Button>
      </MainLayout>
    )
  }
}

export default App
