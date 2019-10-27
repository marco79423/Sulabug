import React, {useEffect, useReducer} from 'react'
import {ipcRenderer} from 'electron'
import {Link} from 'react-router-dom'

console.log('manager module loaded')


function reducer(state, action) {
  switch (action.type) {
    case 'manager/increment-count':
      return {...state, count: state.count + 1}
    default:
      return state
  }
}

export default function Manager() {
  const [state, dispatch] = useReducer(reducer, {count: 0})

  useEffect(() => {
    setTimeout(() => {
      console.log('state', state)
      ipcRenderer.send('sulabug-action', {type: 'add-log', data: state.count})
      dispatch({type: 'manager/increment-count'})
    }, 1000)
  }, [state.count])

  return (
    <div>
      manager <Link to='/browser'>browser</Link>
    </div>
  )
}
