import React, { createContext, useCallback, useEffect, useState } from "react";
import api, { getPokemonImageUrl } from "../services/api";
import axios from "axios";
// import { Pagination } Sfrom "semantic-ui-react";

export const PokemonContext = createContext();

export const PokemonProvider = (props) => {
  const [pokemons, setPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [favoritos, setFavoritos] = useState(() => {
    return JSON.parse(localStorage.getItem("favoritos") || "[]");
  });

  const [capturados, setCapturados] = useState(() => {
    return JSON.parse(localStorage.getItem("capturados") || "[]");
  });

  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  useEffect(() => {
    localStorage.setItem("capturados", JSON.stringify(capturados));
  }, [capturados]);

  const fetchPokemonsDetails = useCallback(async (pokemons) => {
    for (const pokemon of pokemons) {
      const { data } = await axios.get(pokemon.url);
      pokemon.id = data.id;
      pokemon.types = data.types;
      pokemon.image = getPokemonImageUrl(data.id);
      pokemon.favorite = favoritos.includes(data.id);
      pokemon.caught = capturados.includes(data.id);
    }
    setPokemons([...pokemons]);
  }, [favoritos, capturados]);

  const updatePokemon = (pokemon) => {
    const index = pokemons.findIndex(({ id }) => id === pokemon.id);
    if (index >= 0) {
      const nextPokemons = [...pokemons];
      nextPokemons[index] = pokemon;
      setPokemons(nextPokemons);
    }

    setFavoritos((prev) =>
      pokemon.favorite
        ? prev.includes(pokemon.id)
          ? prev
          : [...prev, pokemon.id]
        : prev.filter((id) => id !== pokemon.id),
    );

    setCapturados((prev) =>
      pokemon.caught
        ? prev.includes(pokemon.id)
          ? prev
          : [...prev, pokemon.id]
        : prev.filter((id) => id !== pokemon.id),
    );
  };

  const fetchPokemons = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const offset = (page - 1) * 24;
      const { data } = await api.get(`/pokemon?limit=24&offset=${offset}`);
      setPageCount(Math.ceil(data.count / 24));
      await fetchPokemonsDetails(data.results);
    } finally {
      setLoading(false);
    }
  }, [fetchPokemonsDetails]);

  useEffect(() => {
    fetchPokemons(currentPage);
  }, [fetchPokemons, currentPage]);

  const toggleFavorito = (pokemonId) => {
    setPokemons((prev) =>
      prev.map((pokemon) =>
        pokemon.id === pokemonId
          ? { ...pokemon, favorite: !pokemon.favorite }
          : pokemon,
      ),
    );

    setFavoritos((prev) =>
      prev.includes(pokemonId)
        ? prev.filter((id) => id !== pokemonId)
        : [...prev, pokemonId],
    );
  };

  const toggleCapturado = (pokemonId) => {
    setPokemons((prev) =>
      prev.map((pokemon) =>
        pokemon.id === pokemonId
          ? { ...pokemon, caught: !pokemon.caught }
          : pokemon,
      ),
    );

    setCapturados((prev) =>
      prev.includes(pokemonId)
        ? prev.filter((id) => id !== pokemonId)
        : [...prev, pokemonId],
    );
  };

  return (
    <PokemonContext.Provider
      value={{
        pokemons,
        updatePokemon,
        favoritos,
        capturados,
        toggleFavorito,
        toggleCapturado,
        currentPage,
        pageCount,
        setCurrentPage,
        loading,
      }}
    >
      {props.children}
    </PokemonContext.Provider>
  );
};
