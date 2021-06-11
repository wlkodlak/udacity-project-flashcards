import { Draft, produce } from 'immer'
import { Action, AnyAction, Reducer } from 'redux'

export interface DecksState {
    readonly inProgress: boolean
    readonly decks: DecksCollection
}

export interface DecksCollection {
    readonly [id: string]: DeckState
}

export interface DeckState {
    readonly id: string
    readonly title: string
    readonly cards: CardState[]
}

export interface CardState {
    readonly question: string
    readonly answer: string
}

export enum DeckActionType {
    InProgress = "decks/in_progress",
    Loaded = "decks/loaded",
    AddDeck = "decks/add_deck",
    RemoveDeck = "decks/remove_deck",
    AddCard = "decks/add_card"
}

export interface DeckActionInProgress {
    readonly type: DeckActionType.InProgress
}

export interface DeckActionLoaded {
    readonly type: DeckActionType.Loaded
    readonly decks: DecksCollection
}

export interface DeckActionAddDeck {
    readonly type: DeckActionType.AddDeck
    readonly deck: DeckState
}

export interface DeckActionAddCard {
    readonly type: DeckActionType.AddCard
    readonly deckId: string
    readonly card: CardState
}

export interface DeckActionRemoveDeck {
    readonly type: DeckActionType.RemoveDeck
    readonly deckId: string
}

export type DeckAction = DeckActionInProgress | DeckActionLoaded | DeckActionAddDeck | DeckActionRemoveDeck | DeckActionAddCard

export const createInProgress = (): DeckActionInProgress => ({
    type: DeckActionType.InProgress
})

export const createLoaded = (decks: DecksCollection): DeckActionLoaded => ({
    type: DeckActionType.Loaded,
    decks: decks
})

export const createAddDeck = (title: string): DeckActionAddDeck => ({
    type: DeckActionType.AddDeck,
    deck: {
        id: title,
        title: title,
        cards: []
    }
})

export const createRemoveDeck = (deckId: string): DeckActionRemoveDeck => ({
    type: DeckActionType.RemoveDeck,
    deckId: deckId
})

export const createAddCard = (deckId: string, question: string, answer: string): DeckActionAddCard => ({
    type: DeckActionType.AddCard,
    deckId: deckId,
    card: {
        question: question,
        answer: answer
    }
})

const defaultState: DecksState = {
    inProgress: false,
    decks: {}
}

const recipe = (draft: Draft<DecksState>, action: DeckAction) => {
    switch (action.type) {
        case DeckActionType.InProgress:
            draft.inProgress = true
            break;

        case DeckActionType.Loaded:
            draft.inProgress = false
            draft.decks = action.decks
            break;

        case DeckActionType.AddDeck:
            draft.decks[action.deck.id] = action.deck
            break;

        case DeckActionType.RemoveDeck:
            delete draft.decks[action.deckId]
            break;

        case DeckActionType.AddCard:
            draft.decks[action.deckId].cards.push(action.card)
            break;
    }
}

const reducer: Reducer<DecksState, AnyAction> = produce(recipe, defaultState)

export default reducer
