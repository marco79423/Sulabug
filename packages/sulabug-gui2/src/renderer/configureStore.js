import {createStore} from 'redux'


export default function configureStore() {
  const store = createStore(
    state => state,
  )

  return store
}
