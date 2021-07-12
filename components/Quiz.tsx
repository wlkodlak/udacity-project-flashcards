import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { QuizNavigationProp, QuizRouteProp } from "../navigation";
import { DecksRepository, DeckState, useDecksRepository } from "../storage";
import { QuizQuestionView } from "./QuizQuestionView";
import { QuizResultsView } from "./QuizResultsView";

export default function QuizScreenWired() {
    const navigation = useNavigation<QuizNavigationProp>()
    const route = useRoute<QuizRouteProp>()
    const repository = useDecksRepository()
    return (
        <QuizScreen
            navigation={navigation}
            route={route}
            repository={repository}
        />
    )
}

export function QuizScreen({
    navigation,
    route,
    repository
}: {
    navigation: QuizNavigationProp,
    route: QuizRouteProp,
    repository: DecksRepository
}) {
    const deckId = route.params?.deckId
    const [inProgress, setInProgress] = useState(false)
    const [deck, setDeck] = useState<DeckState | undefined>()
    const [correct, setCorrect] = useState(0)
    const [cardIndex, setCardIndex] = useState(0)
    const [isShowingQuestion, setShowingQuestion] = useState(true)

    const handleOnCorrect = useCallback(() => {
        if (!deck) return
        setCorrect(correct + 1)
        setCardIndex(cardIndex + 1)
        setShowingQuestion(true)
    }, [correct, cardIndex, deck])

    const handleOnIncorrect = useCallback(() => {
        if (!deck) return
        setCardIndex(cardIndex + 1)
        setShowingQuestion(true)
    }, [cardIndex, deck])

    const handleRestart = useCallback(() => {
        setCorrect(0)
        setCardIndex(0)
        setShowingQuestion(true)
    }, [])

    const handleBackToDeck = useCallback(() => {
        navigation.navigate("DeckDetail", { deckId })
    }, [])

    useEffect(() => {
        (async () => {
            setInProgress(true)
            setDeck(await repository.getDeck(deckId))
            setInProgress(false)
        })()
    }, [repository, deckId])

    if (inProgress || !deck) {
        return (
            <View>
                <ActivityIndicator size="large" color="#ff0000" />
            </View>
        )
    } else if (cardIndex < deck.cards.length) {
        const card = deck.cards[cardIndex]
        return (
            <QuizQuestionView
                cardNumber={cardIndex + 1}
                cardsCount={deck.cards.length}
                question={card.question}
                answer={card.answer}
                isShowingQuestion={isShowingQuestion}
                onFlip={setShowingQuestion}
                onCorrect={handleOnCorrect}
                onIncorrect={handleOnIncorrect}
            />
        )
    } else {
        const incorrect = deck.cards.length - correct
        return (
            <QuizResultsView
                correctCount={correct}
                incorrectCount={incorrect}
                onRestart={handleRestart}
                onBackToDeck={handleBackToDeck}
            />
        )
    }
}
