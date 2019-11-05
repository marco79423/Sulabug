import React, {useEffect} from 'react'
import {ipcRenderer} from 'electron'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'

console.log('manager module loaded')


export default function Manager() {
  const dispatch = useDispatch()
  const count = useSelector((state: any) => state.manager.count)

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
