import { DeckState } from '../state/decks';
import { DecksRepository } from './index';

export class DecksRepositoryInMemory implements DecksRepository {

    private index: {
        [id: string]: DeckState;
    } = {};

    async getAllDecks(): Promise<DeckState[]> {
        return Object.values(this.index);
    }

    async getDeck(deckId: string): Promise<DeckState | undefined> {
        return this.index[deckId];
    }

    async putDeck(deck: DeckState): Promise<void> {
        this.index[deck.id] = deck;
    }

    async removeDeck(deckId: string): Promise<void> {
        delete this.index[deckId];
    }
}
