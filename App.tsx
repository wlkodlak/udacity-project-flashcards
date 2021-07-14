import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'
import { BottomTabBarOptions, BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { DecksRepositoryContext, DecksRepositoryAsyncStorage } from './storage'
import { HomeTabParamList, RootStackParamList } from './navigation'
import AddDeck from './components/AddDeck'
import DeckList from './components/DeckList'
import DeckDetail from './components/DeckDetail'
import AddCard from './components/AddCard'
import Quiz from './components/Quiz'

const decksRepository = new DecksRepositoryAsyncStorage()

const Stack = createStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<HomeTabParamList>()

const tabBarOptions: BottomTabBarOptions = {
  activeTintColor: '#ff0000',
  inactiveTintColor: '#888888'
}

const homeTabOptions: BottomTabNavigationOptions = {
  title: 'Decks',
  tabBarIcon: ({ color, size }) => (
    <Ionicons name="md-book" size={size} color={color} />
  )
}

const addDeckTabOptions: BottomTabNavigationOptions = {
  title: 'Add deck',
  tabBarIcon: ({ color, size }) => (
    <Ionicons name="add-circle" size={size} color={color} />
  )
}

const deckDetailStackOptions: StackNavigationOptions = {
  title: 'Deck details'
}

const addCardStackOptions: StackNavigationOptions = {
  title: 'Add card'
}

const quizStackOptions: StackNavigationOptions = {
  title: 'Quiz'
}

function HomeTabs () {
  return (
    <Tab.Navigator tabBarOptions={tabBarOptions}>
      <Tab.Screen
        name="Decks"
        component={DeckList}
        options={homeTabOptions}
      />
      <Tab.Screen
        name="AddDeck"
        component={AddDeck}
        options={addDeckTabOptions}
      />
    </Tab.Navigator>
  )
}

export default function App () {
  return (
    <DecksRepositoryContext.Provider value={decksRepository}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeTabs}
          />
          <Stack.Screen
            name="DeckDetail"
            component={DeckDetail}
            options={deckDetailStackOptions}
          />
          <Stack.Screen
            name="AddCard"
            component={AddCard}
            options={addCardStackOptions}
          />
          <Stack.Screen
            name="Quiz"
            component={Quiz}
            options={quizStackOptions}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DecksRepositoryContext.Provider>
  )
}
