import React, {useEffect, useReducer} from 'react'
import {ipcRenderer} from 'electron'
import {Link} from 'react-router-dom'

console.log('browser module loaded')

function reducer(state, action) {
  switch (action.type) {
    case 'add-log':
      return {...state, logs: [...state.logs, action.data]}
    default:
      return state
  }
}

export default function Browser() {
  const [state, dispatch] = useReducer(reducer, {logs: []})
  useEffect(() => {
    ipcRenderer.on('sulabug-action', (e, action) => {
      dispatch(action)
    })
  }, [])

  return (
    <div>
      browser <Link to={`/manager`}>manager</Link>
      <ul>
        {state.logs.map((log, i) => <li key={i}>{log}</li>)}
      </ul>
    </div>
  )
}
