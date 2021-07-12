import { useNavigation, useRoute } from "@react-navigation/native"
import React, { useCallback, useState } from "react"
import { useEffect } from "react"
import { ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { DeckDetailNavigationProp, DeckDetailRouteProp } from "../navigation"
import { useDecksRepository, DeckState, DecksRepository } from "../storage"
import { DeckView } from "./DeckList"

export default function DeckDetailScreenWired() {
    const navigation = useNavigation<DeckDetailNavigationProp>()
    const route = useRoute<DeckDetailRouteProp>()
    const repository = useDecksRepository()

    return (<DeckDetailScreen
        route={route}
        navigation={navigation}
        repository={repository}
    />)
}

export function DeckDetailScreen({
    route,
    navigation,
    repository
}: {
    route: DeckDetailRouteProp,
    navigation: DeckDetailNavigationProp,
    repository: DecksRepository
}) {
    const deckId = route.params?.deckId
    const [inProgress, setInProgress] = useState(false)
    const [version, setVersion] = useState(0)
    const [deck, setDeck] = useState<DeckState | undefined>(undefined)

    useEffect(() => {
        repository.subscribe(() => setVersion(version + 1))
    }, [repository, version])

    useEffect(() => {
        (async () => {
            setInProgress(true)
            const loadedDeck = await repository.getDeck(deckId)
            setInProgress(false)
            setDeck(loadedDeck)
        })()
    }, [repository, version, deckId])

    const onAddCard = useCallback((deck: DeckState) => {
        navigation.push("AddCard", { deckId })
    }, [deckId])

    const onStartQuiz = useCallback((deck: DeckState) => {
        navigation.push("Quiz", { deckId })
    }, [deckId])

    const onDeleteDeck = useCallback(async (deck: DeckState) => {
        await repository.removeDeck(deckId)
        navigation.navigate("Home", { screen: "Decks" })
    }, [deckId])

    if (inProgress || !deck) {
        return (
            <View>
                <ActivityIndicator size="large" color="#ff0000" />
            </View>
        )
    } else {
        return (
            <DeckDetailView
                deck={deck}
                onAddCard={onAddCard}
                onStartQuiz={onStartQuiz}
                onDeleteDeck={onDeleteDeck}
            />
        )
    }
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
