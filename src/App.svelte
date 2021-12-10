<script>
	import http from './helpers/RequestHelper';
	import OperationDocsHelper from './helpers/OperationDocsHelper';
	import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
	import { setClient,subscribe } from "svelte-apollo";
	import {WebSocketLink} from '@apollo/client/link/ws'


	function createApolloClient() {
	const wsLink = new WebSocketLink({
		uri:"wss://web-laba-3.herokuapp.com/v1/graphql",
		options:{
			reconnect:true
		}
	})
	const cache = new InMemoryCache();
	const client = new ApolloClient({
		link: wsLink,
		cache,
	});
	return client;
 	}
	const client = createApolloClient();
 	setClient(client);
	 const subscribed = subscribe(OperationDocsHelper.SubscriptionAllPokemon())
	const addPokemon = async () => {
		const name = prompt("Enter name: ") || "";
		const ability = prompt("Enter ability: ") || "";
		await http.startExecuteMyMutation(OperationDocsHelper.addOnePokemon(name,ability));
		// pokemons.update(n=>[...n,{name,ability}])
	}

	const deletePokemon = async () => {
		const name = prompt("Enter name to delete: ")|| "";
		await http.startExecuteMyMutation(OperationDocsHelper.deletePokemonsByName(name));
		// pokemons.update(n=>n.filter(item => item.name!==name));
	}
</script>

<main>
	{#if $subscribed.loading}
	<h1>Loading</h1>
	{:else if $subscribed.error}
	<h1>Error</h1>
	{:else}
	<button on:click={addPokemon}>Add pokemon</button>
		<button on:click={deletePokemon}>Delete pokemon</button>
		<table border="1">
			<thead>
				<th>name</th>
				<th>ability</th>
			</thead>
			<tbody>
				{#each $subscribed.data.pokemons as pokemon}
					<tr>
						<th>{pokemon.name}</th>
						<th>{pokemon.ability}</th>
					</tr>
				{/each}
			</tbody>
		</table>
{/if}
	
</main>

<style>
</style>