import React, {useEffect} from 'react'
import {ipcRenderer} from 'electron'
import {useDispatch, useSelector} from 'react-redux'


export default function Browser() {
  const dispatch = useDispatch()
  const logs = useSelector(state => state.browser.logs)

  useEffect(() => {
    ipcRenderer.on('sulabug-action', (e, action) => {
      dispatch(action)
    })

    dispatch({type: 'common/initialize-app', data: 'browser'})
  }, [])

  return (
    <div>
      browser
      <ul>
        {logs.map((log, i) => <li key={i}>{log}</li>)}
      </ul>
    </div>
  )
}
