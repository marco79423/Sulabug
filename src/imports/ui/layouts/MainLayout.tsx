import * as React from 'react'
import teal from '@material-ui/core/colors/teal'
import lime from '@material-ui/core/colors/lime'
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles'

import BaseLayout from './BaseLayout'


interface PropsTypes {
}

export default class MainLayout extends React.Component<PropsTypes, {}> {

  private theme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        main: teal[800]
      },
      secondary: {
        main: lime[600]
      },
    },
  })

  render() {
    return (
      <MuiThemeProvider theme={this.theme}>
        <BaseLayout>
          {this.props.children}
        </BaseLayout>
      </MuiThemeProvider>
    )
  }
}
