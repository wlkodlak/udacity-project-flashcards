import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useState, FunctionComponent } from 'react'

import { TouchableOpacity, StyleSheet, Text, TextInput, View } from 'react-native'
import { AddDeckNavigationProp } from '../navigation'
import { DecksRepository, DeckState, useDecksRepository } from '../storage'

const AddDeckScreenWired: FunctionComponent = () => {
  const navigation = useNavigation<AddDeckNavigationProp>()
  const repository = useDecksRepository()
  return (
    <AddDeckScreen
      navigation={navigation}
      repository={repository}
    />)
}

export default AddDeckScreenWired

interface AddDeckScreenProps {
    navigation: AddDeckNavigationProp,
    repository: DecksRepository
}

export const AddDeckScreen: FunctionComponent<AddDeckScreenProps> = ({
  navigation,
  repository
}) => {
  const [title, setTitle] = useState('')

  const onTitleChange = useCallback((title: string) => {
    setTitle(title)
  }, [setTitle])

  const onSubmit = useCallback(async () => {
    const deck: DeckState = {
      id: title,
      title: title,
      cards: []
    }
    await repository.putDeck(deck)
    setTitle('')
    navigation.navigate('Decks')
  }, [title, repository, setTitle, navigation])

  return (
    <AddDeckView
      title={title}
      onTitleChange={onTitleChange}
      submitDisabled={title === ''}
      onSubmit={onSubmit}
    />
  )
}

interface AddDeckViewProps {
    title: string,
    onTitleChange: (title: string) => void,
    submitDisabled: boolean,
    onSubmit: () => void
}

export const AddDeckView: FunctionComponent<AddDeckViewProps> = ({
  title,
  onTitleChange,
  submitDisabled,
  onSubmit
}) => {
  const submitDisabledStyle = submitDisabled ? addDeckStyles.SubmitDisabled : null

  return (
    <View style={addDeckStyles.AddDeckView}>
      <Text
        style={addDeckStyles.Message}
      >
        What is the name of the new deck?
      </Text>
      <TextInput
        style={addDeckStyles.Input}
        value={title}
        onSubmitEditing={onSubmit}
        onChangeText={onTitleChange}
        returnKeyType="done"
        accessibilityLabel="Deck name"
      />
      <TouchableOpacity
        onPress={onSubmit}
        disabled={submitDisabled}
        style={[addDeckStyles.Submit, submitDisabledStyle]}
        accessibilityLabel="Add deck"
      >
        <Text>Add deck</Text>
      </TouchableOpacity>
    </View>
  )
}

export const addDeckStyles = StyleSheet.create({
  AddDeckView: {
    flexDirection: 'column',
    padding: 16,
    alignItems: 'center'
  },
  Message: {
    width: '100%',
    fontSize: 32,
    marginBottom: 24,
    marginTop: 48,
    textAlign: 'center'
  },
  Input: {
    width: '100%',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    marginBottom: 24,
    padding: 4
  },
  Submit: {
    width: '80%',
    backgroundColor: '#ff0000',
    paddingStart: 12,
    paddingEnd: 12,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 4,
    fontSize: 14,
    textAlign: 'center'
  },
  SubmitDisabled: {
    backgroundColor: '#aaaaaa'
  }
})
