// script.js
let APIurl = 'https://pokeapi.co/api/v2/pokemon?limit=251';
let pokemons = [];
let capturados = [];

async function getData() {
   try {
      var request = {
         method: "GET",
         headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
         }
      };
      let res = await fetch(APIurl, request);
      let result = await res.json();
      let pokemonList = result.results;

      let promises = pokemonList.map((pokemonData) => {
         return getPokemon(pokemonData.url);
      });

      await Promise.all(promises);

      pokemons.sort((a, b) => {
         return a.id - b.id;
      });

      pokemons.forEach((pokemon) => {
         createNode(pokemon);
      });

   } catch (e) {
      console.log(e);
   }
}

async function getPokemon(url) {
   try {
      var request = {
         method: "GET",
         headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
         }
      };
      let res = await fetch(url, request);
      let result = await res.json();
      let pokemon = result;
      pokemons.push(pokemon);

      pokemon.evolutionChainUrl = pokemon.species.url;

      await getEvolutionChain(pokemon);

   } catch (e) {
      console.log(e);
   }
}

async function getEvolutionChain(pokemon) {
   try {
      let res = await fetch(pokemon.evolutionChainUrl);
      let result = await res.json();
      pokemon.evolutionChain = result;
   } catch (e) {
      console.log(e);
   }
}

function createNode(poke) {
   var ul = document.getElementById("ListaPokemon");
   var li = document.createElement("li");
   var img = document.createElement("img");
   var button = document.createElement("button");
   button.onclick = () => Capture(poke);
   button.innerHTML = "Capturar";
   button.id = poke.name;
   li.appendChild(document.createTextNode(`${poke.name} (#${poke.id})`));
   li.appendChild(img);
   li.appendChild(button);
   img.src = poke.sprites.front_default;
   ul.appendChild(li);

   var detailsButton = document.createElement("button");
   detailsButton.innerHTML = 'Detalhes';
   detailsButton.onclick = () => MostrarDetalhes(poke);
   li.appendChild(detailsButton);
}

function Capture(pokemon) {
   if (capturados.length < 6) {
      capturados.push(pokemon);
      createList(pokemon);
   } else {
      alert("Você não pode mais capturar nenhum Pokemon");
   }
}

function RemoveFromTeam(pokemon) {
   var index = capturados.indexOf(pokemon);
   if (index !== -1) {
      capturados.splice(index, 1);
      atualizarListaCapturados();
   }
}

function createList(capturado) {
   var ul = document.getElementById("ListaPokemonsCapturados");
   var li = document.createElement("li");
   var img = document.createElement("img");
   var release = document.createElement("button");
   img.src = capturado.sprites.front_default;
   li.appendChild(img);
   li.appendChild(document.createTextNode(capturado.name));

   var detailsButton = document.createElement("button");
   detailsButton.innerHTML = 'Detalhes';
   detailsButton.onclick = () => MostrarDetalhes(capturado);
   li.appendChild(detailsButton);

   var removeButton = document.createElement("button");
   removeButton.innerHTML = 'Remover';
   removeButton.onclick = () => RemoveFromTeam(capturado);
   li.appendChild(removeButton);

   ul.appendChild(li);

   if (capturados.length > 6) {
      capturados.shift();
      atualizarListaCapturados();
   }
}

function MostrarDetalhes(pokemon) {
   alert(`Detalhes do Pokémon:
      Nome: ${pokemon.name}
      Número: ${pokemon.id}
      Tipo: ${pokemon.types.map(type => type.type.name).join(", ")}
      Altura: ${pokemon.height / 10} cm
      Peso: ${pokemon.weight / 10} kg`);
}

function atualizarListaCapturados() {
   var ul = document.getElementById("ListaPokemonsCapturados");
   ul.innerHTML = "";
   capturados.forEach((pokemon) => {
      createList(pokemon);
   });
}

getData();
