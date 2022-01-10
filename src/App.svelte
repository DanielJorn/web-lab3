<script>
  import http from "./helpers/RequestHelper";
  import OperationDocsHelper from "./helpers/OperationDocsHelper";
  import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
  import { setClient, subscribe } from "svelte-apollo";
  import { WebSocketLink } from "@apollo/client/link/ws";
  import { counter, errors } from "./store";
  let online;
  const pokemonInfo = {};

  function createApolloClient() {
    const wsLink = new WebSocketLink({
      uri: WS_LINK,
      options: {
        reconnect: true,
      },
    });
    const cache = new InMemoryCache();
    return new ApolloClient({
      link: wsLink,
      cache,
    });
  }
  const client = createApolloClient();
  setClient(client);
  const subscribed = subscribe(OperationDocsHelper.SubscriptionAllPokemon());
  const addPokemon = async () => {
    const { name, ability } = pokemonInfo;
    try {
      if (!name || !ability) throw new Error("No empty");
      await http.startExecuteMyMutation(
        OperationDocsHelper.addOnePokemon(name, ability),
      );
    } catch (e) {
      console.error(e);
      $errors = [e.message];
    }
  };

  const deletePokemon = async (id) => {
    try {
      await http.startExecuteMyMutation(
        OperationDocsHelper.deletePokemonsById(id),
      );
    } catch (e) {
      console.error(e);
      $errors = [e.message];
    }
  };
</script>

<svelte:window bind:online />
<main>
  {#if !online}
    <h1>No internet</h1>
  {:else if $subscribed.loading || $counter}
    <h1>Loading</h1>
  {:else if $subscribed.error || $errors.length}
    <h1>Error</h1>
    {$errors.join("\n")}
  {:else}
    <div>
      <input placeholder="Name..." bind:value={pokemonInfo.name} />
      <input placeholder="Ability..." bind:value={pokemonInfo.ability} />
      <button on:click={addPokemon}>Add pokemon</button>
    </div>
    {#if $subscribed.data.pokemons.length}
      <table border="1">
        <thead>
          <th>name</th>
          <th>ability</th>
          <th>delete</th>
        </thead>
        <tbody>
          {#each $subscribed.data.pokemons as pokemon (pokemon.id)}
            <tr>
              <th>{pokemon.name}</th>
              <th>{pokemon.ability}</th>
              <button on:click={() => deletePokemon(pokemon.id)}
                >Delete pokemon</button
              >
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <h1>No pokemons!!!</h1>
    {/if}
  {/if}
</main>

<style>
  main {
    margin: 0;
  }

  tr,
  th {
    padding: 10px;
  }
</style>
