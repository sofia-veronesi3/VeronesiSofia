// Arrays para guardar los Pokémon y tiradas
    const equipoA = [];
    const equipoB = [];
    const tiradasA = [];
    const tiradasB = [];
    const maxTiradas = 3;

    // Función para obtener un Pokémon aleatorio (de los primeros 150)
    async function obtenerPokemon() {
      const maxId = 150;
      const id = Math.floor(Math.random() * maxId) + 1;
      const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const pokemon = await respuesta.json();
      return pokemon;
    }

    // Cargar 3 Pokémon para cada equipo y mostrar en pantalla
    async function cargarEquipos() {
      for (let i = 0; i < 3; i++) {
        equipoA.push(await obtenerPokemon());
        equipoB.push(await obtenerPokemon());
      }
      mostrarEquipos();
    }

    // Mostrar los Pokémon de cada equipo
    function mostrarEquipos() {
      const contenedorA = document.getElementById("pokemonesA");
      const contenedorB = document.getElementById("pokemonesB");
      contenedorA.innerHTML = "";
      contenedorB.innerHTML = "";

      equipoA.forEach(pokemon => contenedorA.innerHTML += mostrarPokemon(pokemon));
      equipoB.forEach(pokemon => contenedorB.innerHTML += mostrarPokemon(pokemon));
    }

    // Crear el HTML para un Pokémon (con ataque y defensa)
    function mostrarPokemon(pokemon) {
      // .find busca en stats el objeto cuyo stat.name es "attack"
      const ataque = pokemon.stats.find(s => s.stat.name === "attack").base_stat;
      const defensa = pokemon.stats.find(s => s.stat.name === "defense").base_stat;

      // Retornamos el bloque HTML para mostrar
      return `
        <div class="pokemon">
          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
          <strong>${pokemon.name.toUpperCase()}</strong><br />
          Ataque: ${ataque} | Defensa: ${defensa}
        </div>
      `;
    }

    // Simular tiradas de dados para un equipo
    function tirarDados(equipo, tiradas, idDisplay, idBoton) {
      if (tiradas.length < maxTiradas) {
        const dado1 = Math.floor(Math.random() * 6) + 1;
        const dado2 = Math.floor(Math.random() * 6) + 1;
        const suma = dado1 + dado2;
        tiradas.push(suma);
        document.getElementById(idDisplay).innerText = tiradas.join(", ");
      }

      // Deshabilitar botón cuando llegue a 3 tiradas
      if (tiradas.length === maxTiradas) {
        document.getElementById(idBoton).disabled = true;
      }

      // Habilitar botón batalla si ambos equipos tiraron 3 veces
      if (tiradasA.length === maxTiradas && tiradasB.length === maxTiradas) {
        document.getElementById("iniciarBatalla").disabled = false;
      }
    }

    // Calcular totales de ataque y defensa de un equipo
    function calcularTotales(equipo) {
      let ataqueTotal = 0;
      let defensaTotal = 0;

      equipo.forEach(pokemon => {
        ataqueTotal += pokemon.stats.find(s => s.stat.name === "attack").base_stat;
        defensaTotal += pokemon.stats.find(s => s.stat.name === "defense").base_stat;
      });

      return { ataqueTotal, defensaTotal };
    }

    // Lógica para decidir el ganador
    function iniciarBatalla() {
      const totA = calcularTotales(equipoA);
      const totB = calcularTotales(equipoB);

      const difA = totA.ataqueTotal - totB.defensaTotal;
      const difB = totB.ataqueTotal - totA.defensaTotal;

      let ganador = "";

      if (difA > difB) {
        ganador = "Equipo A";
      } else if (difB > difA) {
        ganador = "Equipo B";
      } else {
        // Desempate con dados
        const maxA = Math.max(...tiradasA);
        const maxB = Math.max(...tiradasB);

        if (maxA > maxB) ganador = "Equipo A (desempate dados)";
        else if (maxB > maxA) ganador = "Equipo B (desempate dados)";
        else ganador = "Empate total";
      }

      mostrarResultado(totA, totB, difA, difB, ganador);
    }

    // Mostrar resultado final en pantalla
    function mostrarResultado(totA, totB, difA, difB, ganador) {
      const maxA = Math.max(...tiradasA);
      const maxB = Math.max(...tiradasB);
      const tiradaMaxA = tiradasA.indexOf(maxA) + 1;
      const tiradaMaxB = tiradasB.indexOf(maxB) + 1;

      document.getElementById("resultado").innerHTML = `
        <h2>Resultado Final</h2>
        <p> GANADOR :<strong>${ganador}</strong></p>
        <p>Equipo A - Ataque: ${totA.ataqueTotal}, Defensa: ${totA.defensaTotal}</p>
        <p>Equipo B - Ataque: ${totB.ataqueTotal}, Defensa: ${totB.defensaTotal}</p>
        <p>Diferencia A vs B: ${difA}</p>
        <p>Diferencia B vs A: ${difB}</p>
        <p>Mayor tirada Equipo A: ${maxA} (tirada ${tiradaMaxA})</p>
        <p>Mayor tirada Equipo B: ${maxB} (tirada ${tiradaMaxB})</p>
      `;
    }

    // Eventos de los botones
    document.getElementById("dadosA").onclick = () => tirarDados("A", tiradasA, "tiradasA", "dadosA");
    document.getElementById("dadosB").onclick = () => tirarDados("B", tiradasB, "tiradasB", "dadosB");
    document.getElementById("iniciarBatalla").onclick = iniciarBatalla;

    // Cargar los equipos al cargar la página
    cargarEquipos();
