import React from 'react'
import '@testing-library/jest-native/extend-expect'
import { render, fireEvent, RenderAPI, waitFor } from '@testing-library/react-native'
import { DecksRepositoryInMemory, DeckState } from '../storage'
import { AddCardScreen } from '../components/AddCard'
import { AddCardRouteProp } from '../navigation'
import { createDeck } from './utils'

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

type NavigatedRoute = {
  method: String,
  route: String,
  params: any
}

describe('AddCardScreen', () => {
  const repository = new DecksRepositoryInMemory()
  let tree: RenderAPI
  const deck: DeckState = createDeck(2, 4)

  const route: AddCardRouteProp = {
    key: 'AddCard',
    name: 'AddCard',
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

  const getQuestion = () => tree.getByPlaceholderText('Question')
  const getAnswer = () => tree.getByPlaceholderText('Answer')
  const getSubmit = () => tree.getByTestId('AddCard-Submit')
  const findSubmit = () => tree.findByTestId('AddCard-Submit')

  beforeEach(() => {
    jest.clearAllMocks()
    repository.setup([
      deck
    ])
    tree = render(
        <AddCardScreen
          route={route}
          navigation={navigation as any}
          repository={repository}
        />
    )
  })

  it('initially empty', async () => {
    const question = getQuestion()
    const answer = getAnswer()
    const submit = getSubmit()

    expect(question.props.value).toBe('')
    expect(answer.props.value).toBe('')
    expect(submit).toBeDisabled()
  })

  it('when answer is empty, submit button is disabled', async () => {
    const question = getQuestion()

    fireEvent.changeText(question, 'Question')

    const submit = await findSubmit()
    expect(submit).toBeDisabled()
  })

  it('when question is empty, submit button is disabled', async () => {
    const answer = getAnswer()

    fireEvent.changeText(answer, 'Answer')

    const submit = await findSubmit()
    expect(submit).toBeDisabled()
  })

  it('when question and answer are filled, submit button is enabled', async () => {
    const question = getQuestion()
    const answer = getAnswer()

    fireEvent.changeText(question, 'Question')
    fireEvent.changeText(answer, 'Answer')

    const submit = await findSubmit()
    expect(submit).toBeEnabled()
  })

  it('when submit button is clicked, card is added to deck', async () => {
    const question = getQuestion()
    const answer = getAnswer()
    fireEvent.changeText(question, 'Question')
    fireEvent.changeText(answer, 'Answer')
    const submit = await findSubmit()

    fireEvent.press(submit)

    const newDeck = await waitFor(() => repository.getDeck(deck.id))
    expect(newDeck).toBeTruthy()
    const newCards = newDeck?.cards || []
    expect(newCards.length).toBe(deck.cards.length + 1)
    const lastCard = newCards[newCards.length - 1]
    expect(lastCard.question).toBe('Question')
    expect(lastCard.answer).toBe('Answer')
  })

  it('when submit button is clicked, navigate to the deck details', async () => {
    const question = getQuestion()
    const answer = getAnswer()
    fireEvent.changeText(question, 'Question')
    fireEvent.changeText(answer, 'Answer')
    const submit = await findSubmit()

    fireEvent.press(submit)
    const navigatedTo = await waitForNavigation()

    expect(navigatedTo).toBeTruthy()
    expect(navigatedTo?.route).toBe('DeckDetail')
    expect(navigatedTo?.params.deckId).toBe(deck.id)
  })
})
