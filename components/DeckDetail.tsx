import { useNavigation, useRoute } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import React, { useCallback } from "react"
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { DeckDetailNavigationProp, DeckDetailRouteProp } from "../navigation"
import { RootState } from "../state"
import { createRemoveDeck, DeckState } from "../state/decks"
import { useDecksRepository } from "../storage"
import { DeckView } from "./DeckList"

export default function DeckDetailScreen() {
    const navigation = useNavigation<DeckDetailNavigationProp>()
    const route = useRoute<DeckDetailRouteProp>()
    const deckId = route.params?.deckId
    const decks = useSelector((state: RootState) => state.decks.decks)
    const deck = decks[deckId]
    const dispatch = useDispatch()
    const repository = useDecksRepository()

    const onAddCard = useCallback((deck: DeckState) => {
        navigation.push("AddCard", { deckId })
    }, [deckId])

    const onStartQuiz = useCallback((deck: DeckState) => {
        navigation.push("Quiz", { deckId })
    }, [deckId])

    const onDeleteDeck = useCallback((deck: DeckState) => {
        dispatch(createRemoveDeck(deckId))
        repository.removeDeck(deckId)
        navigation.navigate("Home", { screen: "Decks" })
    }, [deckId])

    return (
        <DeckDetailView
            deck={deck}
            onAddCard={onAddCard}
            onStartQuiz={onStartQuiz}
            onDeleteDeck={onDeleteDeck}
        />
    )
}

function DeckDetailView(
    {
        deck,
        onAddCard,
        onStartQuiz,
        onDeleteDeck
    }: {
        deck: DeckState,
        onAddCard: (deck: DeckState) => void,
        onStartQuiz: (deck: DeckState) => void,
        onDeleteDeck: (deck: DeckState) => void
    }
) {
    const onAddCardAdapted = useCallback(() => {
        onAddCard(deck)
    }, [deck, onAddCard])

    const onStartQuizAdapted = useCallback(() => {
        onStartQuiz(deck)
    }, [deck, onStartQuiz])

    const onDeleteDeckAdapted = useCallback(() => {
        onDeleteDeck(deck)
    }, [deck, onDeleteDeck])

    return (
        <View
            style={deckDetailStyles.DeckDetailScreen}
        >
            <DeckView deck={deck} />

            <View
                style={deckDetailStyles.DeckDetailButtonsContainer}
            >

                <TouchableOpacity
                    onPress={onAddCardAdapted}
                    style={deckDetailStyles.DeckDetailButton}
                >
                    <Text>Add card</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onStartQuizAdapted}
                    style={deckDetailStyles.DeckDetailButton}
                >
                    <Text>Start quiz</Text>
                </TouchableOpacity>

            </View>

            <Pressable
                onPress={onDeleteDeckAdapted}
            >
                <Text style={deckDetailStyles.DeckDetailLink}>Delete deck</Text>
            </Pressable>

        </View>
    )
}

const deckDetailStyles = StyleSheet.create({
    DeckDetailScreen: {
        margin: 16,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        height: "100%"
    },
    DeckHeader: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#333333",
        backgroundColor: "#ffffff",
        width: "100%",
        height: 80,
        marginBottom: 16
    },
    DeckDetailTitle: {
        color: "#000000",
        fontSize: 20,
        fontWeight: "bold"
    },
    DeckDetailSubtitle: {
        color: "#333333",
        fontSize: 12
    },
    DeckDetailButtonsContainer: {
        width: "80%"
    },
    DeckDetailButton: {
        width: "100%",
        backgroundColor: "#ff0000",
        fontSize: 15,
        paddingStart: 12,
        paddingEnd: 12,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 4,
        textAlign: "center",
        marginBottom: 8
    },
    DeckDetailLink: {
        color: "#ff0000",
        fontSize: 12
    }
})