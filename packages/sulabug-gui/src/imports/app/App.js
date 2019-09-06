import * as React from 'react'
import {Provider} from 'react-redux'
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles'
import teal from '@material-ui/core/colors/teal'
import lime from '@material-ui/core/colors/lime'
import {HashRouter, Route, Switch} from 'react-router-dom'
import {Redirect} from 'react-router'

import configureStore from './configureStore'
import Main from './startups/Main'
import Reader from './startups/Reader'

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
          <HashRouter>
            <Switch>
              <Redirect exact from='/' to='/main/browse'/>
              <Route path="/main" component={Main}/>
              <Route path="/reader" component={Reader}/>
            </Switch>
          </HashRouter>
        </Provider>
      </MuiThemeProvider>
    )
  }
}
