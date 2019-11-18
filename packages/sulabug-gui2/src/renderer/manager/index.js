import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {ipcRenderer} from 'electron'


export default function Manager() {
  const dispatch = useDispatch()

  useEffect(() => {
    ipcRenderer.on('sulabug-action', (e, action) => {
      dispatch(action)
    })

    dispatch({type: 'common/initialize-app', data: 'manager'})
  }, [])

  return (
    <div>
      manager
    </div>
  )
}
