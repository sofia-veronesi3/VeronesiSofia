const equipoA = [], equipoB = [];
    const tiradasA = [], tiradasB = [];
    let maxTiradas = 3;

    async function obtenerPokemon() {
      const maxId = 150;
      const id = Math.floor(Math.random() * maxId) + 1;
      const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return await resp.json();
    }

    async function cargarEquipos() {
      for (let i = 0; i < 3; i++) {
        equipoA.push(await obtenerPokemon());
        equipoB.push(await obtenerPokemon());
      }
      mostrarEquipos();
    }

    function mostrarEquipos() {
      const contA = document.getElementById('pokemonesA');
      const contB = document.getElementById('pokemonesB');
      contA.innerHTML = '';
      contB.innerHTML = '';

      equipoA.forEach(poke => contA.innerHTML += mostrarPokemon(poke));
      equipoB.forEach(poke => contB.innerHTML += mostrarPokemon(poke));
    }

    function mostrarPokemon(p) {
      const ataque = p.stats.find(s => s.stat.name === 'attack').base_stat;
      const defensa = p.stats.find(s => s.stat.name === 'defense').base_stat;
      return `
        <div class="pokemon">
          <img src="${p.sprites.front_default}" alt="${p.name}"><br>
          <strong>${p.name.toUpperCase()}</strong><br>
          Ataque: ${ataque} | Defensa: ${defensa}
        </div>`;
    }

    function tirarDados(equipo, tiradas, display, boton) {
      if (tiradas.length < maxTiradas) {
        let dado1 = Math.floor(Math.random() * 6) + 1;
        let dado2 = Math.floor(Math.random() * 6) + 1;
        let suma = dado1 + dado2;
        tiradas.push(suma);
        document.getElementById(display).innerText = tiradas.join(', ');
      }
      if (tiradas.length === maxTiradas) {
        document.getElementById(boton).disabled = true;
      }
      if (tiradasA.length === maxTiradas && tiradasB.length === maxTiradas) {
        document.getElementById('iniciarBatalla').disabled = false;
      }
    }

    function calcularTotales(equipo) {
      let ataqueTotal = 0, defensaTotal = 0;
      equipo.forEach(p => {
        ataqueTotal += p.stats.find(s => s.stat.name === 'attack').base_stat;
        defensaTotal += p.stats.find(s => s.stat.name === 'defense').base_stat;
      });
      return { ataqueTotal, defensaTotal };
    }

    function iniciarBatalla() {
      const totA = calcularTotales(equipoA);
      const totB = calcularTotales(equipoB);

      const difA = totA.ataqueTotal - totB.defensaTotal;
      const difB = totB.ataqueTotal - totA.defensaTotal;

      let ganador = '';

      if (difA > difB) ganador = 'Equipo A';
      else if (difB > difA) ganador = 'Equipo B';
      else {
        // Desempate por dados
        const maxA = Math.max(...tiradasA);
        const maxB = Math.max(...tiradasB);
        if (maxA > maxB) ganador = 'Equipo A (por dados)';
        else if (maxB > maxA) ganador = 'Equipo B (por dados)';
        else ganador = 'Empate total';
      }

      mostrarResultado(totA, totB, difA, difB, ganador);
    }

    function mostrarResultado(totA, totB, difA, difB, ganador) {
      const maxA = Math.max(...tiradasA);
      const maxB = Math.max(...tiradasB);
      const tiradaMaxA = tiradasA.indexOf(maxA) + 1;
      const tiradaMaxB = tiradasB.indexOf(maxB) + 1;

      document.getElementById('resultado').innerHTML = `
        <h2>Resultado Final</h2>
        <p><strong>${ganador}</strong></p>
        <p>Equipo A - Ataque: ${totA.ataqueTotal}, Defensa: ${totA.defensaTotal}</p>
        <p>Equipo B - Ataque: ${totB.ataqueTotal}, Defensa: ${totB.defensaTotal}</p>
        <p>Diferencia A vs B: ${difA}</p>
        <p>Diferencia B vs A: ${difB}</p>
        <p>Mayor tirada Equipo A: ${maxA} (tirada ${tiradaMaxA})</p>
        <p>Mayor tirada Equipo B: ${maxB} (tirada ${tiradaMaxB})</p>
      `;
    }

    document.getElementById('dadosA').onclick = () => tirarDados('A', tiradasA, 'tiradasA', 'dadosA');
    document.getElementById('dadosB').onclick = () => tirarDados('B', tiradasB, 'tiradasB', 'dadosB');
    document.getElementById('iniciarBatalla').onclick = iniciarBatalla;

    cargarEquipos();
