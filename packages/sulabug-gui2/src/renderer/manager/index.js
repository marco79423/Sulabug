import React, {useEffect} from 'react'
import {ipcRenderer} from 'electron'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'


export default function Manager() {
  const dispatch = useDispatch()
  const count = useSelector(state => state.manager.count)

  useEffect(() => {
    dispatch({type: 'common/initialize-app', data: 'manager'})
  }, [])


  useEffect(() => {
    setTimeout(() => {
      console.log('count', count)
      ipcRenderer.send('sulabug-action', {type: 'browser/add-log', data: count})
      dispatch({type: 'manager/increment-count'})
    }, 1000)
  }, [count])

  return (
    <div>
      manager <Link to='/browser'>browser</Link>
    </div>
  )
}
