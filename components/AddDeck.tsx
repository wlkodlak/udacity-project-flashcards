import React from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function AddDeckScreen() {
    return (
        <View style={addDeckStyles.AddDeckView}>
            <Text style={addDeckStyles.Message}>What is the name of the new deck?</Text>
            <TextInput style={addDeckStyles.Title} />
            <TouchableOpacity style={addDeckStyles.Submit}><Text>Add deck</Text></TouchableOpacity>
        </View>
    )
}

const addDeckStyles = StyleSheet.create({
    AddDeckView: {
        
    },
    Message: {},
    Title: {},
    Submit: {}
})