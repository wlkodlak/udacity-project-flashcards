import { render, fireEvent, within, RenderAPI, waitFor } from '@testing-library/react-native'
import React from 'react'
import { DeckListItem, DeckListScreen } from '../components/DeckList'
import { DeckState } from '../storage/DeckState'
import '@testing-library/jest-native/extend-expect'
import { DecksRepositoryInMemory } from '../storage'
import { DecksNavigationProp } from '../navigation'
import { createDeck } from './utils'

describe('DeckList', () => {
  describe('DeckListItem', () => {
    const deck: DeckState = createDeck(1, 2)
    const onClick = jest.fn()

    let tree: RenderAPI

    beforeEach(() => {
      tree = render(<DeckListItem deck={deck} onClick={onClick} />)
    })

    it('should render button', async () => {
      const button = await tree.findByRole('button')

      expect(button).toBeTruthy()
    })

    it('should be clickable', async () => {
      const button = await tree.findByRole('button')

      fireEvent.press(button)

      expect(onClick).toBeCalled()
    })

    it('should show title', async () => {
      const button = await tree.findByRole('button')
      const title = within(button).getByText('Deck 1')

      expect(title).toBeTruthy()
    })

    it('should show card count', async () => {
      const button = await tree.findByRole('button')
      const title = within(button).getByText(/[0-9]+ cards/)

      expect(title).toHaveTextContent('2 cards')
    })
  })

  describe('DeckListScreen', () => {
    let tree: RenderAPI

    const repository = new DecksRepositoryInMemory()

    const navigate = jest.fn()

    const navigation = {
      navigate: navigate
    } as any as DecksNavigationProp

    beforeEach(() => {
      jest.clearAllMocks()
      repository.setup([
        createDeck(1, 1),
        createDeck(2, 4),
        createDeck(3, 8),
        createDeck(4, 2)
      ])
      tree = render(<DeckListScreen repository={repository} navigation={navigation} />)
    })

    it('shows list of decks', async () => {
      const deckList = await tree.findByTestId('DeckList-Screen')
      const decks = within(deckList).getAllByRole('button')
      expect(decks.length).toBe(4)
    })

    it('first deck has proper title', async () => {
      const deckList = await tree.findByTestId('DeckList-Screen')
      const decks = within(deckList).getAllByRole('button')
      const title = within(decks[0]).getByTestId('DeckList-Title')
      expect(title).toHaveTextContent('Deck 1')
    })

    it('click on deck navigates to details', async () => {
      let route: string | undefined
      let params: any
      navigate.mockImplementation((r, p) => {
        route = r
        params = p
      })
      const deckList = await tree.findByTestId('DeckList-Screen')
      const decks = within(deckList).getAllByRole('button')
      fireEvent.press(decks[0])
      await waitFor(() => expect(navigation.navigate).toBeCalled())
      expect(route).toBe('DeckDetail')
      expect(params.deckId).toBe('deck-1')
    })
  })
})
