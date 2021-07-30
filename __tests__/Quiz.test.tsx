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

  const getQuestionNumber = () => tree.getByTestId('QuizQuestion-Number')
  const getQuestionText = () => tree.getByTestId('QuizQuestion-Text')
  const getQuestionFlip = () => tree.getByTestId('QuizQuestion-Flip')
  const getQuestionCorrect = () => tree.getByTestId('QuizQuestion-Correct')
  const getQuestionIncorrect = () => tree.getByTestId('QuizQuestion-Incorrect')

  const findQuestionNumber = () => tree.findByTestId('QuizQuestion-Number')
  const findQuestionText = () => tree.findByTestId('QuizQuestion-Text')
  const findQuestionCorrect = () => tree.findByTestId('QuizQuestion-Correct')
  const findScoreCount = () => tree.findByTestId('QuizResults-Count')
  const findScorePercent = () => tree.findByTestId('QuizResults-Percent')
  const findRestart = () => tree.findByTestId('QuizResults-Restart')
  const findGoBack = () => tree.findByTestId('QuizResults-GoBack')

  beforeEach(async () => {
    jest.clearAllMocks()
    repository.setup([deck])
    tree = render(
      <QuizScreen
        repository={repository}
        navigation={navigation as any}
        route={route}
      />
    )
    await waitFor(() => !tree.queryByTestId('Quiz-Loading'))
  })

  it('initially shows question of first card', async () => {
    const questionText = getQuestionText()

    expect(questionText).toHaveTextContent('Question 1')
  })

  it('when clicked on flip, shows the answer', async () => {
    const flip = getQuestionFlip()
    fireEvent.press(flip)

    const questionText = await findQuestionText()

    expect(questionText).toHaveTextContent('Answer 1')
  })

  it('when clicked on flip twice, shows question again', async () => {
    const flip = getQuestionFlip()
    fireEvent.press(flip)
    fireEvent.press(flip)

    const questionText = await findQuestionText()

    expect(questionText).toHaveTextContent('Question 1')
  })

  it('shows question number and total count', async () => {
    const questionNumber = getQuestionNumber()

    expect(questionNumber).toHaveTextContent('1 / 4')
  })

  it('when clicked on correct, shows next question', async () => {
    const flip = getQuestionFlip()
    const correct = getQuestionCorrect()

    fireEvent.press(flip)
    fireEvent.press(correct)

    const questionNumber = await findQuestionNumber()
    const questionText = getQuestionText()

    expect(questionNumber).toHaveTextContent('2 / 4')
    expect(questionText).toHaveTextContent('Question 2')
  })

  it('when clicked on incorrect, shows next question', async () => {
    const flip = getQuestionFlip()
    const incorrect = getQuestionIncorrect()

    fireEvent.press(flip)
    fireEvent.press(incorrect)

    const questionNumber = await findQuestionNumber()
    const questionText = getQuestionText()

    expect(questionNumber).toHaveTextContent('2 / 4')
    expect(questionText).toHaveTextContent('Question 2')
  })

  it('when clicked on correct on last question, shows results', async () => {
    const correct = getQuestionCorrect()
    const incorrect = getQuestionIncorrect()

    fireEvent.press(correct)
    fireEvent.press(incorrect)
    fireEvent.press(correct)
    fireEvent.press(correct)

    const questionNumber = await findQuestionNumber()
    expect(questionNumber).toHaveTextContent('Done')
  })

  it('when clicked on incorrect on last question, shows results', async () => {
    const correct = getQuestionCorrect()
    const incorrect = getQuestionIncorrect()

    fireEvent.press(correct)
    fireEvent.press(incorrect)
    fireEvent.press(correct)
    fireEvent.press(incorrect)

    const questionNumber = await findQuestionNumber()
    expect(questionNumber).toHaveTextContent('Done')
  })

  it('results show number of correct answers', async () => {
    const correct = getQuestionCorrect()
    const incorrect = getQuestionIncorrect()

    fireEvent.press(correct)
    fireEvent.press(incorrect)
    fireEvent.press(correct)
    fireEvent.press(correct)

    const score = await findScoreCount()
    expect(score).toHaveTextContent('3 / 4')
  })

  it('results show percentage of correct answers', async () => {
    const correct = getQuestionCorrect()
    const incorrect = getQuestionIncorrect()

    fireEvent.press(correct)
    fireEvent.press(incorrect)
    fireEvent.press(correct)
    fireEvent.press(correct)

    const score = await findScorePercent()
    expect(score).toHaveTextContent('75%')
  })

  it('restart button shows first question', async () => {
    const correct = getQuestionCorrect()
    const incorrect = getQuestionIncorrect()
    fireEvent.press(correct)
    fireEvent.press(incorrect)
    fireEvent.press(correct)
    fireEvent.press(correct)

    const restart = await findRestart()
    fireEvent.press(restart)

    const questionText = await findQuestionText()
    expect(questionText).toHaveTextContent('Question 1')
  })

  it('restart button resets score', async () => {
    let correct = getQuestionCorrect()
    let incorrect = getQuestionIncorrect()
    fireEvent.press(correct)
    fireEvent.press(incorrect)
    fireEvent.press(correct)
    fireEvent.press(correct)

    const restart = await findRestart()
    fireEvent.press(restart)

    correct = await findQuestionCorrect()
    incorrect = getQuestionIncorrect()
    fireEvent.press(incorrect)
    fireEvent.press(incorrect)
    fireEvent.press(incorrect)
    fireEvent.press(correct)
    const score = await findScorePercent()
    expect(score).toHaveTextContent('25%')
  })

  it('go back button navigates to deck details', async () => {
    const correct = getQuestionCorrect()
    const incorrect = getQuestionIncorrect()
    fireEvent.press(correct)
    fireEvent.press(incorrect)
    fireEvent.press(correct)
    fireEvent.press(correct)

    const goBack = await findGoBack()
    fireEvent.press(goBack)

    const navigatedTo = await waitForNavigation()
    expect(navigatedTo?.route).toBe('DeckDetail')
    expect(navigatedTo?.params.deckId).toBe(deck.id)
  })
})
