import { AnyAction, Reducer } from 'redux'
import decks, { DecksState } from './decks'

export interface RootState {
    decks: DecksState
}

const rootReducer: Reducer<RootState, AnyAction> = (previous, action) => ({
    decks: decks(previous?.decks, action)
})

export default rootReducer
