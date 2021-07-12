import React from 'react';
import { useContext } from 'react';
import { DeckState } from './DeckState';
import { DecksRepositoryAsyncStorage } from './DecksRepositoryAsyncStorage';
import { DecksRepositoryInMemory } from './DecksRepositoryInMemory';

export interface DecksRepository {
    getAllDecks(): Promise<DeckState[]>
    getDeck(deckId: string): Promise<DeckState | undefined>
    putDeck(deck: DeckState): Promise<void>
    removeDeck(deckId: string): Promise<void>
    subscribe(callback: () => void): Subscription
}

export type Subscription = () => void

export * from './DecksRepositoryInMemory'
export * from './DecksRepositoryAsyncStorage'
export * from './DeckState'

export const DecksRepositoryContext = React.createContext<DecksRepository>(
    new DecksRepositoryAsyncStorage()
)

export const useDecksRepository = (): DecksRepository => useContext(DecksRepositoryContext)