import * as React from 'react'

import 'typeface-roboto/index.css'

interface PropsTypes {
}

export default class BaseLayout extends React.Component<PropsTypes, {}> {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
