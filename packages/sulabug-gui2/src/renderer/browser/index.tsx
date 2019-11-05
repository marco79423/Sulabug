import React, {useEffect} from 'react'
import {ipcRenderer} from 'electron'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'

console.log('browser module loaded')


export default function Browser() {
  const dispatch = useDispatch()
  const logs = useSelector((state: any) => state.browser.logs)

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
