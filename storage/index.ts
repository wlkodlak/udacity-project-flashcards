import React, { useContext } from 'react'

import { DeckState } from './DeckState'
import { DecksRepositoryAsyncStorage } from './DecksRepositoryAsyncStorage'

export type Subscription = () => void

export interface DecksRepository {
    getAllDecks(): Promise<DeckState[]>
    getDeck(deckId: string): Promise<DeckState | undefined>
    putDeck(deck: DeckState): Promise<void>
    removeDeck(deckId: string): Promise<void>
    subscribe(callback: () => void): Subscription
}

export * from './DecksRepositoryInMemory'
export * from './DecksRepositoryAsyncStorage'
export * from './DeckState'

export const DecksRepositoryContext = React.createContext<DecksRepository>(
  new DecksRepositoryAsyncStorage()
)

export const useDecksRepository = (): DecksRepository => useContext(DecksRepositoryContext)
