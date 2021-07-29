import { DeckState } from './DeckState'
import { DecksRepository, Subscription } from './index'

export class DecksRepositoryInMemory implements DecksRepository {
    private index: {
        [id: string]: DeckState
    } = {}

    private subscribers = new Set<Subscription>()

    async getAllDecks (): Promise<DeckState[]> {
      return Object.values(this.index)
    }

    async getDeck (deckId: string): Promise<DeckState | undefined> {
      return this.index[deckId]
    }

    async putDeck (deck: DeckState): Promise<void> {
      this.index[deck.id] = deck
      this.notify()
    }

    async removeDeck (deckId: string): Promise<void> {
      delete this.index[deckId]
      this.notify()
    }

    setup (decks: DeckState[]) {
      this.index = {}
      decks.forEach(deck => {
        this.index[deck.id] = deck
      })
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
