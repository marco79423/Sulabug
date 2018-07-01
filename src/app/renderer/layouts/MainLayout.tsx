import * as React from 'react'

interface PropsTypes {
}

export default class MainLayout extends React.Component<PropsTypes, {}> {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
