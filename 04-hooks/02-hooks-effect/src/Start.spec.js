import React from 'react'
import { render, cleanup, fireEvent, waitForElement } from '@testing-library/react'
import Start from './Start'
import * as utils from './pokemon.api'

describe('Start', () => {
  afterEach(cleanup)
  beforeEach(() => {
    const bulbasaur = {
      name: 'bulbasaur',
      sprites: { 'front_default': 'front_default', 'back_default': 'back_default', 'front_shiny': 'front_shiny', 'back_shiny': 'back_shiny' }
    }
    utils.getPokemon = jest.fn(() => bulbasaur)
  })

  const waitForPokemon = async () => {
    const { getByTestId, queryByTestId } = render(<Start />)
    fireEvent.change(getByTestId('pokemonid-input'), { target: { value: '1' } })
    fireEvent.click(queryByTestId('find-pokemon'))
    await waitForElement(() => queryByTestId('pokemon'))
    return { getByTestId, queryByTestId }
  }

  it('should not render default pokemon', () => {
    const { queryByTestId } = render(<Start />)
    expect(queryByTestId('pokemon')).not.toBeInTheDocument()
  })

  describe('Find Pokemon button', () => {
    it('should show on render', () => {
      const { queryByTestId } = render(<Start />)
      expect(queryByTestId('find-pokemon')).toBeInTheDocument()
    })

    it('should have text Find Pokemon', () => {
      const { queryByTestId } = render(<Start />)
      expect(queryByTestId('find-pokemon').textContent).toBe('Find Pokemon')
    })

    it('should show pokemon', async () => {
      const { getByTestId, queryByTestId } = render(<Start />)
      fireEvent.change(getByTestId('pokemonid-input'), { target: { value: '1' } })
      fireEvent.click(queryByTestId('find-pokemon'))
      await waitForElement(() => queryByTestId('pokemon'))
      expect(queryByTestId('pokemon')).toBeInTheDocument()
    })
  })

  describe('Clear button', () => {
    it('should show on render', () => {
      const { queryByTestId } = render(<Start />)
      expect(queryByTestId('clear')).toBeInTheDocument()
    })

    it('should have text Clear', () => {
      const { queryByTestId } = render(<Start />)
      expect(queryByTestId('clear').textContent).toBe('Clear')
    })

    it('should reset pokemon', () => {
      const { queryByTestId } = render(<Start />)
      fireEvent.click(queryByTestId('clear'))
      const pokemon = queryByTestId('pokemon')
      expect(pokemon).toBeNull()
    })
  })

  describe('Sprite Front button', () => {
    const buttonTestId = 'sprite-front-button'
    it('should not show on render', () => {
      const { queryByTestId } = render(<Start />)
      expect(queryByTestId(buttonTestId)).not.toBeInTheDocument()
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
    it('should not show on render', () => {
      const { queryByTestId } = render(<Start />)
      expect(queryByTestId(buttonTestId)).not.toBeInTheDocument()
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
    it('should not show on render', () => {
      const { queryByTestId } = render(<Start />)
      expect(queryByTestId(buttonTestId)).not.toBeInTheDocument()
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
    it('should not show on render', () => {
      const { queryByTestId } = render(<Start />)
      expect(queryByTestId(buttonTestId)).not.toBeInTheDocument()
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
})
