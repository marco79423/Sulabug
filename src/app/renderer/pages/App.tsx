import * as React from 'react'
import MainLayout from '../layouts/MainLayout'

interface PropsTypes {
}

export class App extends React.Component<PropsTypes, {}> {
  render() {
    return (
      <MainLayout>
        <div>hello world</div>
      </MainLayout>
    )
  }
}

export default App
