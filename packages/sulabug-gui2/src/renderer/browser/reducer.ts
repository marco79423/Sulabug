export interface IBrowserState {
  logs: string[]
}

const initialState: IBrowserState = {
  logs: [],
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'browser/add-log':
      return {...state, logs: [...state.logs, action.data]}
    default:
      return state
  }
}
