import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import DeckList from './components/DeckList'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './state'
import { DecksRepositoryContext, DecksRepositoryAsyncStorage } from './storage'
import { Provider } from 'react-redux'

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunk
  )
)

const decksRepository = new DecksRepositoryAsyncStorage()

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Decks" component={DeckList} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <DecksRepositoryContext.Provider value={decksRepository}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </DecksRepositoryContext.Provider>
  );
}
