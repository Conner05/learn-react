import React from 'react'
import { cleanup, render, queryAllByTestId } from '@testing-library/react'
import App from './App'

describe('App', () => {
  afterEach(cleanup);

  it('should display lesson 1 toggle', () => {
    const { getByText } = render(<App />)
    const buttonElement = getByText('1')
    expect(buttonElement).toBeInTheDocument()
  })

  it('should not display lesson 0 toggle', () => {
    const { queryByText } = render(<App />)
    const buttonElement = queryByText('0')
    expect(buttonElement).toBeNull()
  })

  it('should display lesson when lesson button is clicked', () => {
    const { queryByTestId, getAllByTestId } = render(<App />)
    const buttons = getAllByTestId('lesson-button')
    for (const button of buttons) {
      button.click()
      const lesson = queryByTestId('lesson')
      expect(lesson).toBeInTheDocument()
    }
  })

  it('should clear lesson when clear is clicked', () => {
    const { getByText, queryByTestId } = render(<App />)
    const clearButton = getByText(/Clear/i)
    const buttonElement = getByText('1')
    buttonElement.click()
    let lesson = queryByTestId('lesson')
    expect(lesson).toBeInTheDocument()
    clearButton.click()
    lesson = queryByTestId('lesson')
    expect(lesson).toBeNull()
  })
})
