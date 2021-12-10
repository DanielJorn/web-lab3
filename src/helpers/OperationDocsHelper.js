import { gql } from "@apollo/client";

export default class OperationDocsHelper {
  static getAllPokemons = () => `
  query MyQuery {
        pokemons {
          name
          id
          ability
        }
      }`;
  static addOnePokemon = (name, ability) => `
  mutation MyMutation {
    insert_pokemons_one(object: {ability: "${ability}", name: "${name}"}) {
      ability
      name
    }
  }
  `;
  static deletePokemonsByName = (name) => `
  mutation MyMutation {
    delete_pokemons(where: {name: {_eq: "${name}"}}) {
      affected_rows
    }
  }
  `;
  static SubscriptionAllPokemon = () => gql`
    subscription MySubscription {
      pokemons {
        name
        ability
      }
    }
  `;
}
