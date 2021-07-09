import { useNavigation } from '@react-navigation/core'
import React, { useCallback } from 'react'
import { View, Text, StyleSheet, VirtualizedList, Pressable, ListRenderItemInfo } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../state'
import { DecksCollection, DeckState } from '../state/decks'

export default function DeckListScreen() {
    const decks = useSelector((state: RootState) => state.decks.decks)
    const navigation = useNavigation()
    const onClick = useCallback((deck: DeckState) => {
        navigation.navigate('DeckDetail')
    }, [navigation])
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
        <Pressable style={deckStyles.DeckListItem} onPress={onPress}>
            <Text style={deckStyles.DeckListItemTitle}>{deck.title}</Text>
            <Text style={deckStyles.DeckListItemSubtitle}>{deck.cards.length} cards</Text>
        </Pressable>
    )
}

const deckStyles = StyleSheet.create({
    DeckListScreen: {},
    DeckListView: {},
    DeckListItem: {},
    DeckListItemTitle: {},
    DeckListItemSubtitle: {}
})

