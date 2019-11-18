export interface IBrowserState {
  logs: string[]
}

const initialState: IBrowserState = {
  logs: [],
}

export function reducer(state = initialState, action) {
  switch (action.type) {
    case 'browser/add-log':
      return {...state, logs: [...state.logs, action.payload]}
    default:
      return state
  }
}

export function* browserSaga() {
  console.log('browser')
}
