import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { StyleSheet, View } from "react-native";

export function QuizResultsView({
    correctCount, incorrectCount, onRestart, onBackToDeck
}: {
    correctCount: number;
    incorrectCount: number;
    onRestart: () => void;
    onBackToDeck: () => void;
}) {
    const totalCount = correctCount + incorrectCount
    const percentage = correctCount * 100 / totalCount
    const isGoodScore = percentage >= 50

    return (
        <View style={quizResultsStyles.Screen}>

            <Text style={quizResultsStyles.Number}>Done</Text>

            <View style={quizResultsStyles.ScoreContainer}>
                <Text style={quizResultsStyles.Number}>Quiz complete!</Text>
                <Text style={isGoodScore ? quizResultsStyles.ScoreGood : quizResultsStyles.ScoreBad}>
                    {correctCount} / {totalCount}
                </Text>
            </View>

            <View style={quizResultsStyles.ScoreContainer}>
                <Text style={quizResultsStyles.Number}>Percentage correct</Text>
                <Text style={isGoodScore ? quizResultsStyles.ScoreGood : quizResultsStyles.ScoreBad}>
                    {percentage.toFixed(0)}%
                </Text>
            </View>

            <View style={quizResultsStyles.ButtonsContainer}>

                <TouchableOpacity
                    onPress={onRestart}
                    style={quizResultsStyles.RestartButton}
                >
                    <Text>Restart quiz</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onBackToDeck}
                    style={quizResultsStyles.BackButton}
                >
                    <Text>Back to deck</Text>
                </TouchableOpacity>

            </View>


        </View>
    );
}

const quizResultsStyles = StyleSheet.create({
    Screen: {
        flexDirection: "column",
        justifyContent: "space-between"
    },
    Number: {
        alignSelf: "flex-start",
        color: "#000000",
        fontSize: 20,
        fontWeight: "normal",
        textAlign: "left"
    },
    ScoreContainer: {
        width: "100%",
    },
    ScoreLabel: {
        width: "100%",
        color: "#000000",
        fontSize: 12,
        fontWeight: "normal",
        textAlign: "center"
    },
    ScoreGood: {
        width: "100%",
        color: "#00ff00",
        fontSize: 32,
        fontWeight: "normal",
        textAlign: "center"
    },
    ScoreBad: {
        width: "100%",
        color: "#ff0000",
        fontSize: 32,
        fontWeight: "normal",
        textAlign: "center"
    },
    ButtonsContainer: {
        width: "100%"
    },
    RestartButton: {
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
    BackButton: {
        width: "80%",
        backgroundColor: "#333333",
        color: "#ffffff",
        paddingStart: 12,
        paddingEnd: 12,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 4,
        fontSize: 14,
        textAlign: "center"
    },
})
