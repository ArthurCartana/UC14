import { useEffect, useState } from 'react'

import './App.css'

function App() {
const [pokemon, setPokemon] = useState([]);

async function carregarPokemon() {

  try {

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/`,
      {
        headers: {
          'Content-Type':'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error("Pokémon não encontrado");
    }

  const data = await response.json()

  setPokemon(data.results)
} catch (error) {
  console.log(error)
}

}

useEffect(() =>  {
  carregarPokemon()
}, [])
return (
    <div>

      {pokemon.map((p) => (
        <div key={p.id}>
          <p>{p.name}</p>
        </div>
      ))}
    </div>
  )
}

export default App
