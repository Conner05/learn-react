// export default function getPokemon(id) {
//   fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
//     .then((response) => {
//       return response.json()
//     })
// }

export async function getPokemon(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    return response.json()
  } catch (err) {
    console.log(err)
  }
}