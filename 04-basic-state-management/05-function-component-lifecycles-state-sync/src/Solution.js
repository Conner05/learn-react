import React, { useState, useEffect } from 'react'
import './App.css'
import * as utils from './pokemon.api'

const SPRITES = { frontDefault: 'front_default', backDefault: 'back_default', frontShiny: 'front_shiny', backShiny: 'back_shiny' }

function Solution() {
  const [pokemon, setPokemon] = useState()
  const [pokemonId, setPokemonId] = useState(1)
  const [sprite, setSprite] = useState(SPRITES.frontDefault)

  useEffect(() => {
    const updatePokemon = async () => {
      const newPokemon = await utils.getPokemon(pokemonId)
      if (!newPokemon) return
      setPokemon(newPokemon)
    }
    updatePokemon()
  }, [pokemonId])

  const handleIdChange = (e) => !Number.isNaN(+e.target.value) && setPokemonId(+e.target.value)
  const handleSpriteChange = (sprite) => setSprite(sprite)
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-10 offset-4">
          <div className="row">
            <input data-testid="pokemonid-input" value={pokemonId} onChange={(e) => handleIdChange(e)} placeholder="Pokemon #" />
            &nbsp;
            <button className="btn btn-info" data-testid="prev-button" onClick={() => setPokemonId(pokemonId - 1)}>{'<'}</button>
            &nbsp;
            <button className="btn btn-info" data-testid="next-button" onClick={() => setPokemonId(pokemonId + 1)}>{'>'}</button>
            &nbsp;
            <button className="btn btn-primary" data-testid="reset-button" onClick={() => setPokemonId(1)}>Reset</button>
          </div>
          <div className="row">
            {!!pokemon?.sprites &&
              <div data-testid="pokemon">
                <h3 data-testid="pokemon-name">{pokemon?.name}</h3>
                <img data-testid="pokemon-sprite" src={pokemon?.sprites[sprite]} alt={`${pokemon?.name} ${sprite}`} />
                <div className="btn-group" role="group" aria-label="sprite switcher">
                  <button className="btn btn-info" data-testid="sprite-front-button" onClick={() => handleSpriteChange(SPRITES.frontDefault)}>Front</button>
                  <button className="btn btn-info" data-testid="sprite-back-button" onClick={() => handleSpriteChange(SPRITES.backDefault)}>Back</button>
                  <button className="btn btn-warning" data-testid="sprite-shiny-front-button" onClick={() => handleSpriteChange(SPRITES.frontShiny)}>Shiny Front</button>
                  <button className="btn btn-warning" data-testid="sprite-shiny-back-button" onClick={() => handleSpriteChange(SPRITES.backShiny)}>Shiny Back</button>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Solution
