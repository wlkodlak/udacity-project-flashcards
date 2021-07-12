import { useNavigation } from "@react-navigation/native"
import React, { useCallback, useState } from "react"
import { TouchableOpacity, StyleSheet, Text, TextInput, View } from "react-native"
import { useDispatch } from "react-redux"
import { Dispatch } from "redux"
import { AddDeckNavigationProp } from "../navigation"
import { createAddDeck } from "../state/decks"
import { DecksRepository, useDecksRepository } from "../storage"

export default function AddDeckScreenWired() {
    const navigation = useNavigation<AddDeckNavigationProp>()
    const repository = useDecksRepository()
    const dispatch = useDispatch()
    return (<AddDeckScreen
        navigation={navigation}
        repository={repository}
        dispatch={dispatch}
    />)
}

function AddDeckScreen({
    navigation,
    repository,
    dispatch
}: {
    navigation: AddDeckNavigationProp,
    repository: DecksRepository,
    dispatch: Dispatch<any>,
}) {
    const [title, setTitle] = useState("")

    const onTitleChange = useCallback((title: string) => {
        setTitle(title)
    }, [setTitle])

    const onSubmit = useCallback(async () => {
        const action = createAddDeck(title)
        await repository.putDeck(action.deck)
        dispatch(action)
        setTitle("")
        navigation.navigate("Decks")
    }, [title, repository, dispatch, setTitle, navigation])

    return (
        <AddDeckView
            title={title}
            onTitleChange={onTitleChange}
            submitDisabled={title === ""}
            onSubmit={onSubmit}
        />
    )
}

function AddDeckView(
    {
        title,
        onTitleChange,
        submitDisabled,
        onSubmit
    }: {
        title: string,
        onTitleChange: (title: string) => void,
        submitDisabled: boolean,
        onSubmit: () => void
    }
) {
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
            />
            <TouchableOpacity
                onPress={onSubmit}
                style={[addDeckStyles.Submit, submitDisabledStyle]}
            >
                <Text>Add deck</Text>
            </TouchableOpacity>
        </View>
    )
}

const addDeckStyles = StyleSheet.create({
    AddDeckView: {
        flexDirection: "column",
        margin: 16,
        alignItems: "center"
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