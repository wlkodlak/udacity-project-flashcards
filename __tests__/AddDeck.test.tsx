import { render, fireEvent, RenderAPI, waitFor } from '@testing-library/react-native'
import React from 'react'
import { AddDeckScreen } from '../components/AddDeck'
import '@testing-library/jest-native/extend-expect'
import { DecksRepositoryInMemory } from '../storage'
import { AddDeckNavigationProp } from '../navigation'

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

describe('AddDeck', () => {
  describe('AddDeckScreen', () => {
    let tree: RenderAPI

    const repository = new DecksRepositoryInMemory()

    const navigate = jest.fn()

    const navigation = {
      navigate: navigate
    } as any as AddDeckNavigationProp

    beforeEach(async () => {
      jest.clearAllMocks()
      tree = render(
        <AddDeckScreen
          repository={repository}
          navigation={navigation}
          />
      )
    })

    const getInputField = () => tree.getByA11yLabel('Deck name')
    const findInputField = () => tree.findByA11yLabel('Deck name')
    const getSubmit = () => tree.getByA11yLabel('Add deck')

    it('initially empty', async () => {
      const input = getInputField()
      expect(input).toHaveTextContent('')
    })

    it('cannot submit with empty title', async () => {
      const submit = getSubmit()
      expect(submit).toBeDisabled()
    })

    it('writing enables button', async () => {
      let input = getInputField()
      fireEvent.changeText(input, 'React')
      input = await findInputField()
      expect(input.props.value).toBe('React')
      const submit = getSubmit()
      expect(submit).toBeEnabled()
    })

    it('submit creates new deck', async () => {
      const input = getInputField()
      fireEvent.changeText(input, 'React')
      const submit = getSubmit()
      fireEvent.press(submit)
      const decks = await waitFor(() => repository.getAllDecks())
      expect(decks.filter(d => d.title === 'React').length).toBe(1)
    })

    it('submit navigates to deck list', async () => {
      let route: string | undefined
      navigate.mockImplementation((r) => {
        route = r
      })
      const input = getInputField()
      fireEvent.changeText(input, 'React')
      const submit = getSubmit()
      fireEvent.press(submit)
      await waitFor(() => expect(navigation.navigate).toBeCalled())
      expect(route).toBe('Decks')
    })
  })
})
