import { render, fireEvent, RenderAPI, waitFor } from '@testing-library/react-native'
import React from 'react'
import '@testing-library/jest-native/extend-expect'
import { DecksRepositoryInMemory, DeckState } from '../storage'
import { QuizRouteProp } from '../navigation'
import { QuizScreen } from '../components/Quiz'
import { createDeck } from './utils'

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

type NavigatedRoute = {
  method: String,
  route: String,
  params: any
}

describe('QuizQuestion', () => {
  let tree: RenderAPI

  const repository = new DecksRepositoryInMemory()

  const deck: DeckState = createDeck(2, 4)

  const route: QuizRouteProp = {
    key: 'Quiz',
    name: 'Quiz',
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

  beforeEach(async () => {
    jest.clearAllMocks()
    tree = render(
      <QuizScreen
        repository={repository}
        navigation={navigation as any}
        route={route}
      />
    )
  })

  const getQuestionNumber = () => tree.getByTestId('QuizQuestion-Number')
  const getQuestionText = () => tree.getByTestId('QuizQuestion-Text')
  const getQuestionFlip = () => tree.getByTestId('QuizQuestion-Flip')
  const getQuestionCorrect = () => tree.getByTestId('QuizQuestion-Correct')
  const getQuestionIncorrect = () => tree.getByTestId('QuizQuestion-Incorrect')
  const getScoreCount = () => tree.getByTestId('QuizResults-Count')
  const getScorePercent = () => tree.getByTestId('QuizResults-Percent')
  const getRestart = () => tree.getByTestId('QuizResults-Restart')
  const getGoBack = () => tree.getByTestId('QuizResults-Back')

  const findQuestionNumber = () => tree.findByTestId('QuizQuestion-Number')
  const findQuestionText = () => tree.findByTestId('QuizQuestion-Text')
  const findQuestionFlip = () => tree.findByTestId('QuizQuestion-Flip')
  const findQuestionCorrect = () => tree.findByTestId('QuizQuestion-Correct')
  const findQuestionIncorrect = () => tree.findByTestId('QuizQuestion-Incorrect')
  const findScoreCount = () => tree.findByTestId('QuizResults-Count')
  const findScorePercent = () => tree.findByTestId('QuizResults-Percent')
  const findRestart = () => tree.findByTestId('QuizResults-Restart')
  const findGoBack = () => tree.findByTestId('QuizResults-Back')

  it.todo('initially shows question of first card')
  it.todo('when clicked on flip, shows the answer')
  it.todo('when clicked on flip twice, shows question again')
  it.todo('shows question number and total count')
  it.todo('when clicked on correct, shows next question')
  it.todo('when clicked on incorrect, shows next question')
  it.todo('when clicked on correct on last question, shows results')
  it.todo('when clicked on incorrect on last question, shows results')
  it.todo('results show number of correct answers')
  it.todo('results show percentage of correct answers')
  it.todo('restart button shows first question')
  it.todo('restart button resets score')
  it.todo('go back button navigates to deck details')
})
