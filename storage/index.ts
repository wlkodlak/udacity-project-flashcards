import React from 'react';
import { useContext } from 'react';
import { DeckState } from '../state/decks';
import { DecksRepositoryAsyncStorage } from './DecksRepositoryAsyncStorage';
import { DecksRepositoryInMemory } from './DecksRepositoryInMemory';

export interface DecksRepository {
    getAllDecks(): Promise<DeckState[]>
    getDeck(deckId: string): Promise<DeckState | undefined>
    putDeck(deck: DeckState): Promise<void>
    removeDeck(deckId: string): Promise<void>
}

export * from './DecksRepositoryInMemory'
export * from './DecksRepositoryAsyncStorage'

export const DecksRepositoryContext = React.createContext<DecksRepository>(new DecksRepositoryInMemory())
export const useDecksRepository = (): DecksRepository => useContext(DecksRepositoryContext)