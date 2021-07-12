import { useNavigation } from '@react-navigation/core'
import React, { useCallback } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { View, Text, StyleSheet, VirtualizedList, Pressable, ListRenderItemInfo, ActivityIndicator } from 'react-native'
import { useStore } from 'react-redux'
import { AnyAction, Store } from 'redux'
import { DecksNavigationProp } from '../navigation'
import { RootState } from '../state'
import { createInProgress, createLoaded, DecksCollection, DeckState } from '../state/decks'
import { DecksRepository, useDecksRepository } from '../storage'

export default function DeckListScreenWired() {
    const navigation = useNavigation<DecksNavigationProp>()
    const repository = useDecksRepository()
    const store = useStore<RootState>()
    return (<DeckListScreen 
        navigation={navigation}
        repository={repository}
        store={store}
    />)
}

function useStoreSelector<TState, TResult>(
    store: Store<TState, AnyAction>,
    selector: (state: TState) => TResult
): TResult {
    const extracted = selector(store.getState())
    const [value, setValue] = useState(extracted)
    const invalidated = useCallback(() => {
        const changed = selector(store.getState())
        setValue(changed)
    }, [store])
    useEffect(() => store.subscribe(invalidated), [store])
    return value
}

function DeckListScreen({
    navigation,
    repository,
    store   
}: {
    navigation: DecksNavigationProp,
    repository: DecksRepository,
    store: Store<RootState, AnyAction>
}) {
    const inProgress = useStoreSelector(store, state => state.decks.inProgress)
    const decks = useStoreSelector(store, state => state.decks.decks)

    useEffect(() => {
        (async () => {
            store.dispatch(createInProgress())
            const loadedDecks = await repository.getAllDecks()
            store.dispatch(createLoaded(loadedDecks))
        })()
    }, [])

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

const DeckListViewExtractItemCount = (data: DecksCollection): number =>
    Object.keys(data).length

const DeckListViewExtractItem = (data: DecksCollection, index: number): DeckState =>
    Object.values(data)[index]

function DeckListView({
    decks,
    onClick
}: {
    decks: DecksCollection,
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

