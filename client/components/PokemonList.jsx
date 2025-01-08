import React, {useEffect} from 'react';
import axios from 'axios';
import cx from 'classnames';

export default function PokemonList() {
    const [pokemon, setPokemon] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPokemon, setTotalPokemon] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(0);
    const [sortBy, setSortBy] = React.useState('name');
    const [sortOrder, setSortOrder] = React.useState('name');
    const [limit, setLimit] = React.useState(6);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [filterTypes, setFilterTypes] = React.useState({});
    const [pokemonTypes, setPokemonTypes] = React.useState([]);

    useEffect(() => {
        const getPokemonTypes = async () => {
            const {data} = await axios.get('/pokemontypes');
            setPokemonTypes(data.types);
        }
        getPokemonTypes();
    }, []);


    useEffect(() => {
        const getPokemon = async () => {
            try {
                setLoading(true);
                const {data} = await axios.get('/pokemon', {
                    params: {
                        limit,
                        page: currentPage,
                        sortBy,
                        sortOrder,
                        types: Object.keys(filterTypes).filter(ft => filterTypes[ft]),
                    }
                });
                console.log('axios response data', data);
                setLoading(false);
                setPokemon(data.pokemon);
                setTotalPokemon(data.totalPokemon);
                setTotalPages(data.totalPages);
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error in getPokemon: ${e.message}`);
                } else {
                    console.error(`Unknown Error in getPokemon`, e);
                }

                setLoading(false);
                setError(e);
            }
        }

        getPokemon();
    }, [currentPage, filterTypes, limit, sortBy, sortOrder]);

    const previousPage = (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const nextPage = (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    const pokemonTypeFilterChange = (type) => {
        if (!filterTypes[type]) {
            console.log('adding filter type', type);
            setFilterTypes({ ...filterTypes, [type]: true });
        } else {
            console.log('setFilterTypes', filterTypes, 'type', type)
            setFilterTypes({ ...filterTypes, [type]: false });
        }
        console.log(filterTypes);
    }
    return (<div>
            <div className="filters">
                {pokemonTypes.map(pt => {
                    return <div className={cx("badge filter-badge", { selected: filterTypes[pt] })} key={pt} onClick={e => {
                        pokemonTypeFilterChange(pt);
                    }}>{pt}</div>;
                })}
            </div>
            <div className="pokemon-list">
                {
                    loading ? 'Loading...' : pokemon.map(p =>
                        <div className="pokemon" key={p.name}>
                            <div><img className="pokemon-image" src={p.coverImage} alt={p.name}/></div>
                            <div className="pokemon-name">{p.name}</div>
                            <div className="pokemon-hp">HP: {p.stats.hp}</div>
                            <div className="type-badges">
                                {p.type.map(pt => <div key={`${p.name}-${pt}`} className="badge type-badge">{pt}</div>)}
                            </div>
                        </div>)
                }
            </div>
            <div className="pagination">
                <button className="pagination-button" disabled={currentPage === 1} onClick={previousPage}>Previous
                </button>
                <button className="pagination-button" disabled={currentPage === totalPages} onClick={nextPage}>Next
                </button>
            </div>
        </div>
    )
}
