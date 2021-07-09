import { NavigatorScreenParams, RouteProp } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
    Home: NavigatorScreenParams<HomeTabParamList>;
    DeckDetail: { deckId: string };
    AddCard: { deckId: string };
    Quiz: { deckId: string };
}

export type HomeTabParamList = {
    Decks: undefined;
    AddDeck: undefined;
}

export type DeckDetailRouteProp = RouteProp<RootStackParamList, "DeckDetail">;

export type DeckDetailNavigationProp = StackNavigationProp<RootStackParamList, "DeckDetail">;
