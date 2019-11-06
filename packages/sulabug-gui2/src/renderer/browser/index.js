import React, {useEffect} from 'react'
import {ipcRenderer} from 'electron'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'


export default function Browser() {
  const dispatch = useDispatch()
  const logs = useSelector(state => state.browser.logs)

  useEffect(() => {
    dispatch({type: 'common/initialize-app', data: 'browser'})
  }, [])

  useEffect(() => {
    ipcRenderer.on('sulabug-action', (e, action) => {
      dispatch(action)
    })
  }, [])

  return (
    <div>
      browser <Link to={`/manager`}>manager</Link>
      <ul>
        {logs.map((log, i) => <li key={i}>{log}</li>)}
      </ul>
    </div>
  )
}
