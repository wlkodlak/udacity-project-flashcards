import { DeckState } from './DeckState'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DecksRepository, Subscription } from './index'

export const ASYNC_STORAGE_KEY = 'decks'

export class DecksRepositoryAsyncStorage implements DecksRepository {
    private subscribers = new Set<Subscription>()

    async getAllDecks (): Promise<DeckState[]> {
      const decksJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEY)
      if (!decksJson) { return [] }
      const decks = JSON.parse(decksJson)
      return Object.values(decks)
    }

    async getDeck (deckId: string): Promise<DeckState | undefined> {
      const decksJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEY)
      if (!decksJson) { return undefined }
      const decks = JSON.parse(decksJson)
      return decks[deckId]
    }

    async putDeck (deck: DeckState): Promise<void> {
      let decksJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEY)
      const decks = (decksJson) ? JSON.parse(decksJson) : {}
      decks[deck.id] = deck
      decksJson = JSON.stringify(decks)
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, decksJson)
      this.notify()
    }

    async removeDeck (deckId: string): Promise<void> {
      let decksJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEY)
      const decks = (decksJson) ? JSON.parse(decksJson) : {}
      delete decks[deckId]
      decksJson = JSON.stringify(decks)
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, decksJson)
      this.notify()
    }

    notify () {
      Array.from(this.subscribers).forEach(it => it())
    }

    subscribe (callback: () => void): () => void {
      this.subscribers.add(callback)
      return () => {
        this.subscribers.delete(callback)
      }
    }
}
