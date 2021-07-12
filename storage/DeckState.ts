export interface DeckState {
    readonly id: string
    readonly title: string
    readonly cards: CardState[]
}

export interface CardState {
    readonly question: string
    readonly answer: string
}
