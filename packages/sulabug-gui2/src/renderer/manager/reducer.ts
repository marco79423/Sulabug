export interface IManagerState {
  count: number
}

const initialState: IManagerState = {
  count: 0,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'manager/increment-count':
      return {...state, count: state.count + 1}
    default:
      return state
  }
}
