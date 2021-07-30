import React from 'react'
import { render } from '@testing-library/react-native'
import App from '../App'

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

describe('App', () => {
  it('initially shows decks list', async () => {
    const tree = render(<App />)
    const deckList = await tree.findByTestId('DeckList-Screen')
    expect(deckList).toBeTruthy()
  })
})
