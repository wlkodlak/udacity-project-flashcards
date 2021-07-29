import { useNavigation } from '@react-navigation/core'
import React, { useCallback, useState, useEffect, FunctionComponent } from 'react'

import { View, Text, StyleSheet, VirtualizedList, Pressable, ListRenderItemInfo, ActivityIndicator } from 'react-native'
import { DecksNavigationProp } from '../navigation'
import { DeckState } from '../storage/DeckState'
import { DecksRepository, useDecksRepository } from '../storage'
import useAsyncEffect from 'use-async-effect'

const DeckListScreenWired = () => {
  const navigation = useNavigation<DecksNavigationProp>()
  const repository = useDecksRepository()
  return (<DeckListScreen
        navigation={navigation}
        repository={repository}
    />)
}

export default DeckListScreenWired

interface DeckListScreenProps {
    navigation: DecksNavigationProp,
    repository: DecksRepository
}

export const DeckListScreen: FunctionComponent<DeckListScreenProps> = ({
  navigation,
  repository
}) => {
  const [inProgress, setInProgress] = useState(false)
  const [decks, setDecks] = useState<DeckState[]>([])
  const [version, setVersion] = useState(0)

  useEffect(() => {
    return repository.subscribe(() => {
      setVersion(version + 1)
    })
  }, [repository, version])

  useAsyncEffect(async isMounted => {
    setInProgress(true)
    const loadedDecks = await repository.getAllDecks()
    if (!isMounted()) return
    setInProgress(false)
    setDecks(loadedDecks)
  }, [repository, version])

  const onClick = useCallback((deck: DeckState) => {
    navigation.navigate('DeckDetail', { deckId: deck.id })
  }, [navigation])

  if (inProgress) {
    return (
            <View style={deckStyles.DeckListScreen} testID="DeckList-Loading">
                <ActivityIndicator size="large" color="#ff0000" />
            </View>
    )
  }

  return (
        <View style={deckStyles.DeckListScreen} testID="DeckList-Screen">
            <DeckListView onClick={onClick} decks={decks} />
        </View>
  )
}

const DeckListViewExtractItemCount = (data: DeckState[]): number =>
  data.length

const DeckListViewExtractItem = (data: DeckState[], index: number): DeckState =>
  data[index]

interface DeckListViewProps {
    decks: DeckState[],
    onClick: (deck: DeckState) => void
}

export const DeckListView: FunctionComponent<DeckListViewProps> = ({
  decks,
  onClick
}) => {
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

interface DeckListItemProps {
    deck: DeckState,
    onClick: (deck: DeckState) => void
}

export const DeckListItem: FunctionComponent<DeckListItemProps> = ({
  deck,
  onClick
}) => {
  const onPress = useCallback(() => {
    onClick(deck)
  }, [onClick, deck])
  return (
        <Pressable onPress={onPress} accessibilityRole="button">
            <DeckView deck={deck} />
        </Pressable>
  )
}

interface DeckViewProps {
    deck: DeckState
}

export const DeckView: FunctionComponent<DeckViewProps> = ({
  deck
}) => {
  return (
        <View style={deckStyles.DeckListItem}>
            <Text style={deckStyles.DeckListItemTitle} testID="DeckList-Title">{deck.title}</Text>
            <Text style={deckStyles.DeckListItemSubtitle} testID="DeckList-Count">{deck.cards.length} cards</Text>
        </View>
  )
}

export const deckStyles = StyleSheet.create({
  DeckListScreen: {
    padding: 16,
    height: '100%'
  },
  DeckListView: {
  },
  DeckListItem: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#ffffff',
    width: '100%',
    height: 80,
    marginBottom: 16
  },
  DeckListItemTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold'
  },
  DeckListItemSubtitle: {
    color: '#333333',
    fontSize: 12
  }
})
