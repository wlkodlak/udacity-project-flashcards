import { useNavigation } from '@react-navigation/core'
import React, { useCallback, useState } from 'react'
import { useEffect } from 'react'
import { View, Text, StyleSheet, VirtualizedList, Pressable, ListRenderItemInfo, ActivityIndicator } from 'react-native'
import { DecksNavigationProp } from '../navigation'
import { DeckState } from '../storage/DeckState'
import { DecksRepository, useDecksRepository } from '../storage'

export default function DeckListScreenWired() {
    const navigation = useNavigation<DecksNavigationProp>()
    const repository = useDecksRepository()
    return (<DeckListScreen
        navigation={navigation}
        repository={repository}
    />)
}

function DeckListScreen({
    navigation,
    repository
}: {
    navigation: DecksNavigationProp,
    repository: DecksRepository
}) {
    const [inProgress, setInProgress] = useState(false)
    const [decks, setDecks] = useState<DeckState[]>([])
    const [version, setVersion] = useState(0)

    useEffect(() => {
        repository.subscribe(() => setVersion(version + 1))
    }, [repository, version])

    useEffect(() => {
        (async () => {
            setInProgress(true)
            const loadedDecks = await repository.getAllDecks()
            setInProgress(false)
            setDecks(loadedDecks)
        })()
    }, [repository, version])

    const onClick = useCallback((deck: DeckState) => {
        navigation.navigate('DeckDetail', { deckId: deck.id })
    }, [navigation])

    if (inProgress) {
        return (
            <View style={deckStyles.DeckListScreen}>
                <ActivityIndicator size="large" color="#ff0000" />
            </View>
        )
    }

    return (
        <View style={deckStyles.DeckListScreen}>
            <DeckListView onClick={onClick} decks={decks} />
        </View>
    )
}

const DeckListViewExtractItemCount = (data: DeckState[]): number =>
    data.length

const DeckListViewExtractItem = (data: DeckState[], index: number): DeckState =>
    data[index]

function DeckListView({
    decks,
    onClick
}: {
    decks: DeckState[],
    onClick: (deck: DeckState) => void
}) {
    const renderItem = useCallback((item: ListRenderItemInfo<DeckState>): React.ReactElement => {
        return (
            <DeckListItem key={item.item.id} deck={item.item} onClick={onClick} />
        )
    }, [onClick])
    return (
        <VirtualizedList
            style={deckStyles.DeckListView}
            data={decks}
            getItemCount={DeckListViewExtractItemCount}
            getItem={DeckListViewExtractItem}
            renderItem={renderItem} />
    )
}

function DeckListItem({
    deck,
    onClick
}: {
    deck: DeckState,
    onClick: (deck: DeckState) => void
}) {
    const onPress = useCallback(() => {
        onClick(deck)
    }, [onClick, deck])
    return (
        <Pressable onPress={onPress}>
            <DeckView deck={deck} />
        </Pressable>
    )
}

export function DeckView({
    deck
}: {
    deck: DeckState
}) {
    return (
        <View style={deckStyles.DeckListItem}>
            <Text style={deckStyles.DeckListItemTitle}>{deck.title}</Text>
            <Text style={deckStyles.DeckListItemSubtitle}>{deck.cards.length} cards</Text>
        </View>
    )
}

export const deckStyles = StyleSheet.create({
    DeckListScreen: {
        margin: 16
    },
    DeckListView: {
    },
    DeckListItem: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#333333",
        backgroundColor: "#ffffff",
        width: "100%",
        height: 80,
        marginBottom: 16
    },
    DeckListItemTitle: {
        color: "#000000",
        fontSize: 20,
        fontWeight: "bold"
    },
    DeckListItemSubtitle: {
        color: "#333333",
        fontSize: 12
    }
})

