import React from 'react'
import { render } from '@testing-library/react'
import Solution from './solution'

describe('Solution', () => {
  it('should show Enter button on render', () => {
    const { getByText } = render(<Solution />)
    const enterButton = getByText(/Enter/i)
    expect(enterButton).toBeInTheDocument()
  })

  it('should not show Greeting message on render', () => {
    const { queryByText } = render(<Solution />)
    const greeting = queryByText(/Hello there!/i)
    expect(greeting).toBeNull()
  })

  it('should show Leave button after clicking Enter', () => {
    const { getByText } = render(<Solution />)
    const enterButton = getByText(/Enter/i)
    enterButton.click()
    const leaveButton = getByText(/Leave/i)
    expect(leaveButton).toBeInTheDocument()
  })

  it('should not show Enter button after clicking Enter', () => {
    const { getByText, queryByText } = render(<Solution />)
    let enterButton = getByText(/Enter/i)
    enterButton.click()
    enterButton = queryByText(/Enter/i)
    expect(enterButton).toBeNull()
  })

  it('should not show Leave button after clicking Leave', () => {
    const { getByText, queryByText } = render(<Solution />)
    const enterButton = getByText(/Enter/i)
    enterButton.click()
    let leaveButton = getByText(/Leave/i)
    leaveButton.click()
    leaveButton = queryByText(/Leave/i)
    expect(leaveButton).toBeNull()
  })

  it('should show Greeting message after clicking Enter', () => {
    const { getByText } = render(<Solution />)
    const enterButton = getByText(/Enter/i)
    enterButton.click()
    const greeting = getByText(/Hello there!/i)
    expect(greeting).toBeInTheDocument()
  })

  it('should hide Greeting message after clicking Leave', () => {
    const { getByText, queryByText } = render(<Solution />)
    const enterButton = getByText(/Enter/i)
    enterButton.click()
    const leaveButton = getByText(/Leave/i)
    leaveButton.click()
    const greeting = queryByText(/Hello there!/i)
    expect(greeting).toBeNull()
  })

  it('should show Goodbye message after clicking Leave', () => {
    const { getByText, queryByText } = render(<Solution />)
    const enterButton = getByText(/Enter/i)
    enterButton.click()
    const leaveButton = getByText(/Leave/i)
    leaveButton.click()
    const goodbye = queryByText(/See you later!/i)
    expect(goodbye).toBeInTheDocument()
  })

  it('should hide Goodbye message after clicking Enter/Leave/Enter', () => {
    const { getByText, queryByText } = render(<Solution />)
    let enterButton = getByText(/Enter/i)
    enterButton.click()
    const leaveButton = getByText(/Leave/i)
    leaveButton.click()
    let goodbye = queryByText(/See you later!/i)
    expect(goodbye).toBeInTheDocument()
    enterButton = getByText(/Enter/i)
    enterButton.click()
    goodbye = queryByText(/See you later!/i)
    expect(goodbye).toBeNull()
  })

})

