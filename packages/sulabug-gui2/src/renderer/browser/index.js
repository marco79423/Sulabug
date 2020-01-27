import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {Redirect, Route, Switch} from 'react-router-dom'
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles'
import {lime, teal} from '@material-ui/core/colors'

import CollectionPage from './pages/CollectionPage'
import BrowsePage from './pages/BrowsePage'
import SettingsPage from './pages/SettingsPage'
import DownloadPage from './pages/DownloadPage'


export default function Browser() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({type: 'common/initialize-app', data: 'browser'})
  }, [])

  const theme = createMuiTheme({
    typography: {
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

  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Redirect exact from='/browser' to='/browser/collection'/>
        <Route exact path='/browser/collection' component={CollectionPage}/>
        <Route exact path='/browser/browse' component={BrowsePage}/>
        <Route exact path='/browser/download' component={DownloadPage}/>
        <Route exact path='/browser/settings' component={SettingsPage}/>
      </Switch>
    </ThemeProvider>
  )
}
