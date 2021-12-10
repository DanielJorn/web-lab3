<script>
	import http from './helpers/RequestHelper';
	import OperationDocsHelper from './helpers/OperationDocsHelper';
	import { onMount } from 'svelte';
	import {pokemons} from './stores/mainStore'
	import { get } from 'svelte/store';

	onMount(async ()=>{
		const {data} = await http.fetchMyQuery(OperationDocsHelper.getAllPokemons());
		pokemons.set(data.pokemons)
		console.log((get(pokemons)));
	})

	const addPokemon = async () => {
		const name = prompt("Enter name: ") || "";
		const ability = prompt("Enter ability: ") || "";
		await http.startExecuteMyMutation(OperationDocsHelper.addOnePokemon(name,ability));
		pokemons.update(n=>[...n,{name,ability}])
	}

	const deletePokemon = async () => {
		const name = prompt("Enter name to delete: ")|| "";
		await http.startExecuteMyMutation(OperationDocsHelper.deletePokemonsByName(name));
		pokemons.update(n=>n.filter(item => item.name!==name));
	}
</script>

<main>
	<button on:click={addPokemon}>Add pokemon</button>
	<button on:click={deletePokemon}>Delete pokemon</button>
	<table border="1">
		<thead>
			<th>name</th>
			<th>ability</th>
		</thead>
		<tbody>
			{#each $pokemons as pokemon}
				<tr>
					<th>{pokemon.name}</th>
					<th>{pokemon.ability}</th>
				</tr>
			{/each}
		</tbody>
	</table>
	
</main>

<style>
</style>