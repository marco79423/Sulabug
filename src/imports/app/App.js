import * as React from 'react'
import {Provider} from 'react-redux'
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles'
import teal from '@material-ui/core/colors/teal'
import lime from '@material-ui/core/colors/lime'
import {BrowserRouter} from 'react-router-dom'

import configureStore from './configureStore'
import Main from './pages/Main'

const store = configureStore()

export default class App extends React.Component {

  theme = createMuiTheme({
    typography: {
      useNextVariants: true,
      h2: {
        fontSize: '1.6rem',
      },
      subtitle2: {
        fontSize: '0.8rem',
      },
      body2: {
        fontSize: '0.9rem',
      }
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
        <Provider store={store}>
          <BrowserRouter>
            <Main/>
          </BrowserRouter>
        </Provider>
      </MuiThemeProvider>
    )
  }
}
