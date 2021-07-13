import { useNavigation, useRoute } from "@react-navigation/native";
import produce from "immer";
import React, { useState } from "react";
import { useCallback } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AddCardNavigationProp, AddCardRouteProp } from "../navigation";
import { DecksRepository, useDecksRepository, DeckState } from "../storage";

export default function AddCardScreenWired() {
    const route = useRoute<AddCardRouteProp>()
    const navigation = useNavigation<AddCardNavigationProp>()
    const repository = useDecksRepository()
    return (<AddCardScreen
        route={route}
        navigation={navigation}
        repository={repository}
    />)
}

function AddCardScreen(
    {
        route,
        navigation,
        repository
    }: {
        route: AddCardRouteProp,
        navigation: AddCardNavigationProp,
        repository: DecksRepository
    }
) {
    const deckId = route.params?.deckId

    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const submitDisabled = question === "" || answer === ""

    const onSubmit = useCallback(async () => {
        const deck = await repository.getDeck(deckId)
        if (deck) {
            const newDeck: DeckState = produce(deck, draft => {
                draft.cards.push({
                    question,
                    answer
                })
            })
            await repository.putDeck(newDeck)
        }
        navigation.navigate("DeckDetail", { deckId })
    }, [repository, navigation, deckId, question, answer])

    return (
        <AddCardView
            question={question}
            onQuestionChanged={setQuestion}
            answer={answer}
            onAnswerChanged={setAnswer}
            submitDisabled={submitDisabled}
            onSubmit={onSubmit}
        />
    )
}

function AddCardView({
    question,
    onQuestionChanged,
    answer,
    onAnswerChanged,
    onSubmit,
    submitDisabled
}: {
    question: string,
    onQuestionChanged: (question: string) => void,
    answer: string,
    onAnswerChanged: (answer: string) => void,
    onSubmit: () => void,
    submitDisabled: boolean
}) {

    const submitDisabledStyle = submitDisabled ? addCardStyles.SubmitDisabled : null

    return (
        <View
            style={addCardStyles.AddCardView}
        >
            <View
                style={addCardStyles.Container}
            >
                <Text
                    style={addCardStyles.Message}
                >
                    Add a question
                </Text>

                <TextInput
                    style={addCardStyles.Input}
                    value={question}
                    onChangeText={onQuestionChanged}
                    returnKeyType="next"
                    placeholder="Question"
                />

                <TextInput
                    style={addCardStyles.Input}
                    value={answer}
                    onSubmitEditing={onSubmit}
                    onChangeText={onAnswerChanged}
                    returnKeyType="done"
                    placeholder="Answer"
                />

            </View>

            <TouchableOpacity
                onPress={onSubmit}
                disabled={submitDisabled}
                style={[addCardStyles.Submit, submitDisabledStyle]}
            >
                <Text>Add deck</Text>
            </TouchableOpacity>

        </View>
    )
}


const addCardStyles = StyleSheet.create({
    AddCardView: {
        flexDirection: "column",
        padding: 16,
        justifyContent: "space-around",
        alignItems: "center",
        height: "100%"
    },
    Container: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%"
    },
    Message: {
        width: "100%",
        fontSize: 32,
        marginBottom: 24,
        textAlign: "center"
    },
    Input: {
        width: "100%",
        fontSize: 12,
        borderWidth: 1,
        borderColor: "#333333",
        backgroundColor: "#ffffff",
        borderRadius: 4,
        marginBottom: 24,
        padding: 4
    },
    Submit: {
        width: "80%",
        backgroundColor: "#ff0000",
        paddingStart: 12,
        paddingEnd: 12,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 4,
        fontSize: 14,
        textAlign: "center"
    },
    SubmitDisabled: {
        backgroundColor: "#aaaaaa"
    }
})