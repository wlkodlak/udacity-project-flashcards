import React, { FunctionComponent } from 'react'
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native'

interface QuizResultsViewProps {
    correctCount: number
    incorrectCount: number
    onRestart: () => void
    onBackToDeck: () => void
}

export const QuizResultsView: FunctionComponent<QuizResultsViewProps> = ({
  correctCount, incorrectCount, onRestart, onBackToDeck
}) => {
  const totalCount = correctCount + incorrectCount
  const percentage = correctCount * 100 / totalCount
  const isGoodScore = percentage >= 50

  return (
        <View style={quizResultsStyles.Screen}>

            <Text style={quizResultsStyles.Number}>Done</Text>

            <View style={quizResultsStyles.ScoreContainer}>
                <Text style={quizResultsStyles.ScoreLabel}>Quiz complete!</Text>
                <Text style={isGoodScore ? quizResultsStyles.ScoreGood : quizResultsStyles.ScoreBad}>
                    {correctCount} / {totalCount}
                </Text>
            </View>

            <View style={quizResultsStyles.ScoreContainer}>
                <Text style={quizResultsStyles.ScoreLabel}>Percentage correct</Text>
                <Text style={isGoodScore ? quizResultsStyles.ScoreGood : quizResultsStyles.ScoreBad}>
                    {percentage.toFixed(0)}%
                </Text>
            </View>

            <View style={quizResultsStyles.ButtonsContainer}>

                <TouchableOpacity
                    onPress={onRestart}
                    style={quizResultsStyles.RestartButton}
                >
                    <Text style={quizResultsStyles.RestartButtonText}>Restart quiz</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onBackToDeck}
                    style={quizResultsStyles.BackButton}
                >
                    <Text style={quizResultsStyles.BackButtonText}>Back to deck</Text>
                </TouchableOpacity>

            </View>

        </View>
  )
}

const quizResultsStyles = StyleSheet.create({
  Screen: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    padding: 16
  },
  Number: {
    alignSelf: 'flex-start',
    color: '#000000',
    fontSize: 20,
    fontWeight: 'normal',
    textAlign: 'left'
  },
  ScoreContainer: {
    width: '100%',
    alignItems: 'center'
  },
  ScoreLabel: {
    width: '100%',
    color: '#000000',
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'center'
  },
  ScoreGood: {
    width: '100%',
    color: '#008800',
    fontSize: 32,
    fontWeight: 'normal',
    textAlign: 'center'
  },
  ScoreBad: {
    width: '100%',
    color: '#ff0000',
    fontSize: 32,
    fontWeight: 'normal',
    textAlign: 'center'
  },
  ButtonsContainer: {
    width: '100%',
    marginBottom: 48,
    alignItems: 'center'
  },
  RestartButton: {
    width: '80%',
    backgroundColor: '#008800',
    paddingStart: 12,
    paddingEnd: 12,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 4
  },
  RestartButtonText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center'
  },
  BackButton: {
    width: '80%',
    backgroundColor: '#333333',
    color: '#ffffff',
    paddingStart: 12,
    paddingEnd: 12,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 4,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16
  },
  BackButtonText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center'
  }
})
