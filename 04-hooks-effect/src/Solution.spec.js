import React from 'react'
import { render, cleanup, fireEvent, waitForElement } from '@testing-library/react'
import Solution from './Solution'
import * as utils from './pokemon.api'

describe('Solution', () => {

  beforeEach(() => {
    const bulbasaur = {
      name: 'bulbasaur',
      sprites: { 'front_default': 'front_default', 'back_default': 'back_default', 'front_shiny': 'front_shiny', 'back_shiny': 'back_shiny' }
    }
    const ivysaur = {
      name: 'ivysaur',
      sprites: { 'front_default': 'front_default', 'back_default': 'back_default', 'front_shiny': 'front_shiny', 'back_shiny': 'back_shiny' }
    }
    utils.getPokemon = jest.fn((id) => {
      if (!id) return
      return id == 1 ? bulbasaur : ivysaur
    })
  })

  afterEach(cleanup)

  const waitForPokemon = async (id = 1) => {
    const { getByTestId, queryByTestId } = render(<Solution />)
    await waitForElement(() => queryByTestId('pokemon'))
    fireEvent.change(getByTestId('pokemonid-input'), { target: { value: id } })
    await waitForElement(() => queryByTestId('pokemon'))
    return { getByTestId, queryByTestId }
  }

  it('should render first pokemon', async () => {
    const { queryByTestId } = render(<Solution />)
    await waitForElement(() => queryByTestId('pokemon'))
    expect(queryByTestId('pokemon')).toBeInTheDocument()
  })

  describe('Pokemon # input', () => {
    it('should default to 1', async () => {
      const { queryByTestId } = render(<Solution />)
      expect(queryByTestId('pokemonid-input').value).toBe('1')
      await waitForElement(() => (queryByTestId('pokemon')))
    })

    it('should only allow numbers in the input', async () => {
      const { queryByTestId } = render(<Solution />)
      fireEvent.change(queryByTestId('pokemonid-input'), { target: { value: 'a' } })
      expect(queryByTestId('pokemonid-input').value).toBe('1')
      await waitForElement(() => (queryByTestId('pokemon')))
    })
  })
  describe('Reset button', () => {
    it('should show on render', async () => {
      const { queryByTestId } = render(<Solution />)
      expect(queryByTestId('reset-button')).toBeInTheDocument()
      await waitForElement(() => queryByTestId('pokemon'))
    })

    it('should have text Reset', async () => {
      const { queryByTestId } = render(<Solution />)
      expect(queryByTestId('reset-button').textContent).toBe('Reset')
      await waitForElement(() => queryByTestId('pokemon'))
    })

    it('should reset pokemon', async () => {
      const { queryByTestId } = render(<Solution />)
      fireEvent.change(queryByTestId('pokemonid-input'), { target: { value: '5' } })
      fireEvent.click(queryByTestId('reset-button'))
      expect(queryByTestId('pokemonid-input').value).toBe('1')
      await waitForElement(() => queryByTestId('pokemon'))
    })
  })

  describe('Sprite Front button', () => {
    const buttonTestId = 'sprite-front-button'
    it('should not show before pokemon render', async () => {
      const { queryByTestId } = render(<Solution />)
      expect(queryByTestId(buttonTestId)).not.toBeInTheDocument()
      await waitForElement(() => queryByTestId('pokemon'))
    })

    it('should show after pokemon render', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId(buttonTestId)).toBeInTheDocument()
    })

    it('should have text Front', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId(buttonTestId).textContent).toBe('Front')
    })

    it('should be default', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId('pokemon-sprite')?.getAttribute('src')).toBe('front_default')
    })

    it('should switch the sprite view to front on click', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId('pokemon-sprite')?.getAttribute('src')).toBe('front_default')
      fireEvent.click(queryByTestId('sprite-back-button'))
      expect(queryByTestId('pokemon-sprite')?.getAttribute('src')).toBe('back_default')
      fireEvent.click(queryByTestId(buttonTestId))
      expect(queryByTestId('pokemon-sprite')?.getAttribute('src')).toBe('front_default')
    })
  })

  describe('Sprite Back button', () => {
    const buttonTestId = 'sprite-back-button'
    it('should not show before pokemon render', async () => {
      const { queryByTestId } = render(<Solution />)
      expect(queryByTestId(buttonTestId)).not.toBeInTheDocument()
      await waitForElement(() => queryByTestId('pokemon'))
    })

    it('should show after pokemon render', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId(buttonTestId)).toBeInTheDocument()
    })

    it('should have text Back', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId(buttonTestId).textContent).toBe('Back')
    })

    it('should switch the sprite view to back on click', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId('pokemon-sprite')?.getAttribute('src')).toBe('front_default')
      fireEvent.click(queryByTestId(buttonTestId))
      expect(queryByTestId('pokemon-sprite')?.getAttribute('src')).toBe('back_default')
    })
  })

  describe('Sprite Shiny Back button', () => {
    const buttonTestId = 'sprite-shiny-back-button'
    it('should not show before pokemon render', async () => {
      const { queryByTestId } = render(<Solution />)
      expect(queryByTestId(buttonTestId)).not.toBeInTheDocument()
      await waitForElement(() => queryByTestId('pokemon'))
    })

    it('should show after pokemon render', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId(buttonTestId)).toBeInTheDocument()
    })

    it('should have text Shiny Back', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId(buttonTestId).textContent).toBe('Shiny Back')
    })

    it('should switch the sprite view to shiny back on click', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId('pokemon-sprite')?.getAttribute('src')).toBe('front_default')
      fireEvent.click(queryByTestId(buttonTestId))
      expect(queryByTestId('pokemon-sprite')?.getAttribute('src')).toBe('back_shiny')
    })
  })

  describe('Sprite Shiny Front button', () => {
    const buttonTestId = 'sprite-shiny-front-button'
    it('should not show before pokemon render', async () => {
      const { queryByTestId } = render(<Solution />)
      expect(queryByTestId(buttonTestId)).not.toBeInTheDocument()
      await waitForElement(() => queryByTestId('pokemon'))
    })

    it('should show after pokemon render', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId(buttonTestId)).toBeInTheDocument()
    })

    it('should have text Shiny Front', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId(buttonTestId).textContent).toBe('Shiny Front')
    })

    it('should switch the sprite view to shiny front on click', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId('pokemon-sprite')?.getAttribute('src')).toBe('front_default')
      fireEvent.click(queryByTestId(buttonTestId))
      expect(queryByTestId('pokemon-sprite')?.getAttribute('src')).toBe('front_shiny')
    })
  })

  describe('Next Pokemon button', () => {
    const button = 'next-button'
    it('should show on render', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId(button)).toBeInTheDocument()
    })

    it('should have text >', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId(button).textContent).toBe('>')
    })

    it('should update input to next value', async () => {
      const { queryByTestId } = await waitForPokemon()
      fireEvent.click(queryByTestId(button))
      expect(queryByTestId('pokemonid-input').value).toBe('2')
      await waitForElement(() => queryByTestId('pokemon'))
    })

    it('should display the next pokemon', async () => {
      const { queryByTestId } = await waitForPokemon()
      fireEvent.click(queryByTestId(button))
      await waitForElement(() => queryByTestId('pokemon'))
      expect(queryByTestId('pokemon-name').textContent).toBe('ivysaur')
    })
  })

  describe('Previous Pokemon button', () => {
    const button = 'prev-button'
    it('should show on render', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId(button)).toBeInTheDocument()
    })

    it('should have text >', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId(button).textContent).toBe('<')
    })

    it('should update input to previous value', async () => {
      const { queryByTestId } = await waitForPokemon(2)
      fireEvent.click(queryByTestId(button))
      expect(queryByTestId('pokemonid-input').value).toBe('1')
      await waitForElement(() => queryByTestId('pokemon'))
    })

    it('should display the previous pokemon', async () => {
      const { queryByTestId } = await waitForPokemon(2)
      fireEvent.click(queryByTestId(button))
      await waitForElement(() => queryByTestId('pokemon'))
      expect(queryByTestId('pokemon-name').textContent).toBe('bulbasaur')
    })
  })
})
