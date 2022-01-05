<script>
  import http from "./helpers/RequestHelper";
  import OperationDocsHelper from "./helpers/OperationDocsHelper";
  import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
  import { setClient, subscribe } from "svelte-apollo";
  import { WebSocketLink } from "@apollo/client/link/ws";
  import { counter, errors } from "./store";

  let online;
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
    const name = prompt("Enter name: ") || "";
    const ability = prompt("Enter ability: ") || "";
    try {
      await http.startExecuteMyMutation(
        OperationDocsHelper.addOnePokemon(name, ability),
      );
    } catch (e) {
      console.error(e);
      errors.set([e.message]);
    }
  };

  const deletePokemon = async (id) => {
    try {
      await http.startExecuteMyMutation(
        OperationDocsHelper.deletePokemonsById(id),
      );
    } catch (e) {
      console.error(e);
      errors.set([e.message]);
    }
  };
</script>

<svelte:window bind:online />
<main>
  {#if !online}
    <h1>No internet</h1>
  {:else if $subscribed.loading || $counter !== 0}
    <h1>Loading</h1>
  {:else if $subscribed.error || $errors.length !== 0}
    <h1>Error</h1>
    {$errors.join("\n")}
  {:else}
    <button on:click={addPokemon}>Add pokemon</button>
    <table border="1">
      <thead>
        <th>name</th>
        <th>ability</th>
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
  {/if}
</main>

<style>
  main {
    margin: 0;
  }
</style>
