import * as React from 'react'
import {Provider} from 'react-redux'
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles'
import teal from '@material-ui/core/colors/teal'
import lime from '@material-ui/core/colors/lime'
import {HashRouter, Route, Switch} from 'react-router-dom'

import configureStore from './configureStore'
import BrowsePage from './pages/BrowsePage'
import CollectionPage from './pages/CollectionPage'
import SettingsPage from './pages/SettingsPage'
import ReadingPage from './pages/ReadingPage'
import DownloadPage from './pages/DownloadPage'

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
              <Route exact path="/" component={BrowsePage}/>
              <Route exact path="/collection" component={CollectionPage}/>
              <Route exact path="/download" component={DownloadPage}/>
              <Route exact path="/settings" component={SettingsPage}/>
              <Route exact path="/reading/:comicInfoId" component={ReadingPage}/>
            </Switch>
          </HashRouter>
        </Provider>
      </MuiThemeProvider>
    )
  }
}
