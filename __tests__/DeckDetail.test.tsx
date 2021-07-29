import { fireEvent, render, RenderAPI, waitFor } from '@testing-library/react-native'
import React from 'react'
import { DeckDetailScreen } from '../components/DeckDetail'
import { DeckDetailRouteProp } from '../navigation'
import { DecksRepositoryInMemory, DeckState } from '../storage'
import { createDeck } from './utils'
import '@testing-library/jest-native/extend-expect'

type NavigatedRoute = {
  method: String,
  route: String,
  params: any
}

describe('DeckDetail', () => {
  describe('DeckDetailScreen', () => {
    const repository = new DecksRepositoryInMemory()

    let tree: RenderAPI
    const deck: DeckState = createDeck(2, 4)

    const route: DeckDetailRouteProp = {
      key: 'DeckDetail',
      name: 'DeckDetail',
      params: {
        deckId: deck.id
      }
    }

    const navigation = {
      navigate: jest.fn().mockImplementation((route, params) => {
        navigatedRoute = { method: 'navigate', route, params }
      }),
      push: jest.fn().mockImplementation((route, params) => {
        navigatedRoute = { method: 'push', route, params }
      })
    }

    let navigatedRoute: NavigatedRoute | undefined

    const waitForNavigation = async () => {
      return await waitFor(() => navigatedRoute)
    }

    beforeEach(() => {
      jest.clearAllMocks()
      repository.setup([
        createDeck(1, 1),
        deck,
        createDeck(3, 8),
        createDeck(4, 2)
      ])
      tree = render(
        <DeckDetailScreen
          route={route}
          navigation={navigation as any}
          repository={repository}
        />
      )
    })

    it('when loaded, shows title and cards count', async () => {
      const title = await tree.findByTestId('DeckList-Title')
      const cardsCount = tree.getByTestId('DeckList-Count')

      expect(title).toHaveTextContent('Deck 2')
      expect(cardsCount).toHaveTextContent('4 cards')
    })

    it('when clicked on delete deck, the deck is removed from storage', async () => {
      const button = await tree.findByTestId('DeckDetail-DeleteDeck')
      fireEvent.press(button)
      const decks = await waitFor(() => repository.getAllDecks())
      const matchingDeck = decks.some(d => d.id === deck.id)
      expect(matchingDeck).toBeFalsy()
    })

    it('when clicked on delete deck, navigate to decks list', async () => {
      const deleteDeck = await tree.findByTestId('DeckDetail-DeleteDeck')
      fireEvent.press(deleteDeck)
      const route = await waitForNavigation()
      expect(route?.route).toBe('Home')
      expect(route?.params?.screen).toBe('Decks')
    })

    it('when clicked on add card, navigate to add card page', async () => {
      const button = await tree.findByTestId('DeckDetail-AddCard')
      fireEvent.press(button)
      const route = await waitForNavigation()
      expect(route?.route).toBe('AddCard')
      expect(route?.params?.deckId).toBe(deck.id)
    })

    it('when clicked on quiz, navigate to quiz page', async () => {
      const button = await tree.findByTestId('DeckDetail-Quiz')
      fireEvent.press(button)
      const route = await waitForNavigation()
      expect(route?.route).toBe('Quiz')
      expect(route?.params?.deckId).toBe(deck.id)
    })
  })
})
