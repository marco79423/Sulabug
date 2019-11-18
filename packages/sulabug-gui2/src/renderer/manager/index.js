import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'


export default function Manager() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({type: 'common/initialize-app', data: 'manager'})
  }, [])

  return (
    <div>
      manager
    </div>
  )
}
