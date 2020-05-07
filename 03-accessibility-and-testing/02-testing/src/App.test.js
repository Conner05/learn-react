import React from 'react'
import { cleanup, render } from '@testing-library/react'
import App from './App'

describe('App', () => {
  afterEach(cleanup)

  it('should display lesson start toggle', () => {
    const { getByText } = render(<App />)
    const startButton = getByText(/Start/i)
    expect(startButton).toBeInTheDocument()
  })

  it('should display lesson solution toggle', () => {
    const { getByText } = render(<App />)
    const solutionButton = getByText(/Solution/i)
    expect(solutionButton).toBeInTheDocument()
  })

  it('should display start lesson when Start button is clicked', () => {
    const { queryByTestId, getByText } = render(<App />)
    const startButton = getByText(/Start/i)
    startButton.click()
    const lesson = queryByTestId(/Start-lesson/i)
    expect(lesson).toBeInTheDocument()
  })

  it('should display solution lesson when Solution button is clicked', () => {
    const { queryByTestId, getByText } = render(<App />)
    const startButton = getByText(/Solution/i)
    startButton.click()
    const lesson = queryByTestId(/Solution-lesson/i)
    expect(lesson).toBeInTheDocument()
  })

  it('should clear lesson when clear is clicked', () => {
    const { getByText, queryByTestId } = render(<App />)
    const clearButton = getByText(/Clear/i)
    const startButton = getByText(/Start/i)
    startButton.click()
    let lesson = queryByTestId(/Start-lesson/i)
    expect(lesson).toBeInTheDocument()
    clearButton.click()
    lesson = queryByTestId(/Start-lesson/i)
    expect(lesson).toBeNull()
  })
})
