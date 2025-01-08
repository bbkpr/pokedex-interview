const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors')
const pokemon = require('./pokemon');

app.use(cors())

app.get('/pokemon', (req, res) => {
    const {page = 1, limit = 6, sortBy = 'name', sortOrder = 'asc', types} = req.query;

    let filteredPokemon = [...pokemon];
    if (types) {
        filteredPokemon = filteredPokemon.filter(pokemon => types.every(t => pokemon.type.includes(t)))
    }

    filteredPokemon.sort((a, b) => {
        if (sortBy === 'name') {
            return sortOrder === 'asc' ?
                b.name.localeCompare(a.name) :
                a.name.localeCompare(b.name);
        }
        return 0;
    });

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPokemon = filteredPokemon.slice(startIndex, endIndex);

    const currentPage = parseInt(page);
    const totalPages = Math.ceil(filteredPokemon.length / limit);
    res.json({
        totalPokemon: filteredPokemon.length,
        currentPage,
        totalPages,
        pokemon: paginatedPokemon
    });
});

app.get('/pokemontypes', (req, res) => {
    const pTypes = [];
    pokemon.forEach(p => {
        p.type.forEach((pt) => {
            if (!pTypes.includes(pt)) {
                pTypes.push(pt);
            }
        })

    });
    res.json({types: pTypes});
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
