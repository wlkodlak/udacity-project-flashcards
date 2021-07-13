import React, { useCallback } from "react"
import { Pressable, StyleSheet, Text, TouchableOpacity } from "react-native"
import { View } from "react-native"

export function QuizQuestionView({
    cardNumber, cardsCount, question, answer, isShowingQuestion, onFlip, onCorrect, onIncorrect
}: {
    cardNumber: number
    cardsCount: number
    question: string
    answer: string
    isShowingQuestion: boolean
    onFlip: (willShowQuestion: boolean) => void
    onCorrect: () => void
    onIncorrect: () => void
}) {
    const shownText = isShowingQuestion ? question : answer
    const flipText = isShowingQuestion ? "Show answer" : "Show question"
    const onPressFlip = useCallback(() => {
        onFlip(!isShowingQuestion)
    }, [isShowingQuestion, onFlip])

    return (
        <View style={quizQuestionStyles.QuestionScreen}>

            <Text style={quizQuestionStyles.Number}>{cardNumber} / {cardsCount}</Text>

            <Text style={quizQuestionStyles.Text}>{shownText}</Text>

            <Pressable onPress={onPressFlip}>
                <Text style={quizQuestionStyles.FlipButton}>{flipText}</Text>
            </Pressable>

            <View style={quizQuestionStyles.ButtonsContainer}>

                <TouchableOpacity
                    onPress={onCorrect}
                    style={quizQuestionStyles.CorrectButton}
                >
                    <Text>Correct</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onIncorrect}
                    style={quizQuestionStyles.IncorrectButton}
                >
                    <Text>Incorrect</Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}

const quizQuestionStyles = StyleSheet.create({
    QuestionScreen: {
        padding: 16,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%"
    },
    Number: {
        alignSelf: "flex-start",
        color: "#000000",
        fontSize: 20,
        fontWeight: "normal",
        textAlign: "left"
    },
    Text: {
        width: "100%",
        color: "#000000",
        fontSize: 32,
        fontWeight: "normal",
        textAlign: "center"
    },
    FlipButton: {
        color: "#ff0000",
        fontSize: 12,
        fontWeight: "normal"
    },
    ButtonsContainer: {
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 48
    },
    CorrectButton: {
        width: "80%",
        backgroundColor: "#00ff00",
        color: "#ffffff",
        paddingStart: 12,
        paddingEnd: 12,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 4,
        fontSize: 14,
        textAlign: "center"
    },
    IncorrectButton: {
        width: "80%",
        backgroundColor: "#ff0000",
        color: "#ffffff",
        paddingStart: 12,
        paddingEnd: 12,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 4,
        fontSize: 14,
        textAlign: "center",
        marginTop: 16
    }
})
