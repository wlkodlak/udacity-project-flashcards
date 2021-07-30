import { DeckState } from '../storage'

export const createDeck = (deckNumber: number, cardsCount: number): DeckState => {
  return {
    id: `deck-${deckNumber}`,
    title: `Deck ${deckNumber}`,
    cards: [...Array(cardsCount).keys()].map(index => ({
      question: `Question ${index + 1}`,
      answer: `Answer ${index + 1}`
    }))
  }
}
