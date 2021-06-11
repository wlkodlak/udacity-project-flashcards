import { DeckState } from '../state/decks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DecksRepository } from './index';

export const ASYNC_STORAGE_KEY = "decks"

export class DecksRepositoryAsyncStorage implements DecksRepository {

    async getAllDecks(): Promise<DeckState[]> {
        const decksJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
        if (!decksJson)
            return [];
        return JSON.parse(decksJson);
    }

    async getDeck(deckId: string): Promise<DeckState | undefined> {
        const decksJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
        if (!decksJson)
            return undefined;
        const decks = JSON.parse(decksJson);
        return decks[deckId];
    }

    async putDeck(deck: DeckState): Promise<void> {
        let decksJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
        let decks = (decksJson) ? JSON.parse(decksJson) : {};
        decks[deck.id] = deck;
        decksJson = JSON.stringify(decks);
        await AsyncStorage.setItem(ASYNC_STORAGE_KEY, decksJson);
    }

    async removeDeck(deckId: string): Promise<void> {
        let decksJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
        let decks = (decksJson) ? JSON.parse(decksJson) : {};
        delete decks[deckId];
        decksJson = JSON.stringify(decks);
        await AsyncStorage.setItem(ASYNC_STORAGE_KEY, decksJson);
    }
}
