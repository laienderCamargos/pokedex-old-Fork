import React, { useState,  useContext } from "react";
import { Pokeball } from "../Spinner";
import PokemonCard from "../PokemonCard";
import Search from "../Search";
// import axios from "axios";

import { App } from "./styles";

import { PokemonContext } from "../../providers/pokemon";

const PokemonList = () => {
  const [query, setQuery] = useState("");
  const { pokemons, currentPage, pageCount, setCurrentPage, loading } = useContext(PokemonContext);

  const renderPokemonsList = () => {
    const pokemonsList = [];

    pokemons.forEach((pokemon) => {
      if (!pokemon.name.includes(query)) {
        return;
      }

      pokemonsList.push(<PokemonCard key={pokemon.name} pokemon={pokemon} />);
    });

    return pokemonsList;
  };

  const renderPagination = () => {
    if (!pageCount) return null;

    return (
      <div className="pagination-controls" style={{ textAlign: "center", margin: "20px 0" }}>
        <button disabled={currentPage === 1 || loading} onClick={() => setCurrentPage(currentPage - 1)}>
          Anterior
        </button>
        <span style={{ margin: "0 12px" }}>
          Página {currentPage} de {pageCount}
        </span>
        <button disabled={currentPage === pageCount || loading} onClick={() => setCurrentPage(currentPage + 1)}>
          Próxima
        </button>
      </div>
    );
  };

  if (loading) return <Pokeball />;
  return (
    <>
      <Search getQuery={(q) => setQuery(q)} />
      {renderPagination()}
      <App>{renderPokemonsList()}</App>
      {renderPagination()}
    </>
  );
};

export default PokemonList;
