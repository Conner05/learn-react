import React from 'react'
import { render } from '@testing-library/react'
import Start from './start'

describe('Start', () => {
  it('should show Enter button on render', () => {
    const { getByText } = render(<Start />)
    const enterButton = getByText(/Enter/i)
    expect(enterButton).toBeInTheDocument()
  })

  it('should not show Greeting message on render', () => {
    const { queryByText } = render(<Start />)
    const greeting = queryByText(/Hello there!/i)
    expect(greeting).toBeNull()
  })

  it('should show Leave button after clicking Enter', () => {
    const { getByText } = render(<Start />)
    const enterButton = getByText(/Enter/i)
    enterButton.click()
    const leaveButton = getByText(/Leave/i)
    expect(leaveButton).toBeInTheDocument()
  })

  it('should not show Enter button after clicking Enter', () => {
    const { getByText, queryByText } = render(<Start />)
    let enterButton = getByText(/Enter/i)
    enterButton.click()
    enterButton = queryByText(/Enter/i)
    expect(enterButton).toBeNull()
  })

  it('should not show Leave button after clicking Leave', () => {
    const { getByText, queryByText } = render(<Start />)
    const enterButton = getByText(/Enter/i)
    enterButton.click()
    let leaveButton = getByText(/Leave/i)
    leaveButton.click()
    leaveButton = queryByText(/Leave/i)
    expect(leaveButton).toBeNull()
  })

  it('should show Greeting message after clicking Enter', () => {
    const { getByText } = render(<Start />)
    const enterButton = getByText(/Enter/i)
    enterButton.click()
    const greeting = getByText(/Hello there!/i)
    expect(greeting).toBeInTheDocument()
  })

  it('should hide Greeting message after clicking Leave', () => {
    const { getByText, queryByText } = render(<Start />)
    const enterButton = getByText(/Enter/i)
    enterButton.click()
    const leaveButton = getByText(/Leave/i)
    leaveButton.click()
    const greeting = queryByText(/Hello there!/i)
    expect(greeting).toBeNull()
  })
})

