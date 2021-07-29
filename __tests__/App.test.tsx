import React from 'react'
import { render } from '@testing-library/react-native'
import { View } from 'react-native'

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

describe('RN testing', () => {
  it('initialized', async () => {
    const tree = render(<View testID="Root" />)
    const view = await tree.findByTestId('Root')
    expect(view).toBeTruthy()
  })
})
