import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api, { getPokemonImageUrl2 } from "../../services/api";
import { PokemonContext } from "../../providers/pokemon";
import { Pokeball } from "../Spinner";
import { Badge, Menu, HeaderContainer } from "./styles";

import "./styles.css";

const Pokemon = () => {
  const [pokemon, setPokemom] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePokemon, setImagePokemon] = useState("");

  const { pokemonIndex } = useParams();
  const { pokemons, updatePokemon } = useContext(PokemonContext);

  const handleCaughtClick = () => {
    if (!pokemon.id) return;
    const updated = { ...pokemon, caught: !pokemon.caught };
    setPokemom(updated);
    updatePokemon(updated);
  };

  const handleFavoriteClick = () => {
    if (!pokemon.id) return;
    const updated = { ...pokemon, favorite: !pokemon.favorite };
    setPokemom(updated);
    updatePokemon(updated);
  };

  useEffect(() => {
    const loadPokemonData = async () => {
      try {
        let pokemonId = pokemonIndex;

        // Procura o pokemon no contexto pelo índice
        const pokemonFromContext = pokemons.find(
          (p) =>
            p.name.toLowerCase() === pokemonIndex.toLowerCase() ||
            p.id === parseInt(pokemonIndex),
        );

        const favorite = pokemonFromContext?.favorite || false;
        const caught = pokemonFromContext?.caught || false;

        if (pokemonFromContext) {
          pokemonId = pokemonFromContext.id;
        }

        // Sempre faz a chamada de API para obter dados completos
        const response = await api.get(`pokemon/${pokemonId}`);
        const { name, types, id, weight, height, sprites, stats, abilities } =
          response.data;

        const pokemonData = {
          name: name.replace(/-/g, " "),
          types: types.map(
            (typeInfo) =>
              typeInfo.type.name[0].toUpperCase() + typeInfo.type.name.slice(1),
          ),
          abilities: abilities,
          id: id,
          weight: weight / 10,
          height: height / 10,
          spriteImageUrl: sprites.front_default,
          shinySpriteImageUrl: sprites.front_shiny,
          baseStats: [
            stats[0].base_stat,
            stats[1].base_stat,
            stats[2].base_stat,
            stats[3].base_stat,
            stats[4].base_stat,
            stats[5].base_stat,
          ],
          evs: stats
            .filter((stat) => stat.effort > 0)
            .map((stat) => {
              return `${stat.effort} ${stat.stat.name
                .toLowerCase()
                .split("-")
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(" ")}`;
            })
            .join(", "),
          favorite,
          caught,
        };

        setPokemom(pokemonData);
        setImagePokemon(getPokemonImageUrl2(pokemonData.id));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (pokemonIndex) {
      loadPokemonData();
    }
  }, [pokemonIndex, pokemons]);

  const baseStatsName = [
    "HP",
    "Attack",
    "Defense",
    "Sp. Attack",
    "Sp. Defense",
    "Speed",
  ];

  return isLoading ? (
    <Pokeball />
  ) : (
    <div className="col-12 fadeIn">
      <HeaderContainer>
        <h1 className="text-center text-uppercase Section-Heading">
          {pokemon.name}
        </h1>
        <Menu>
          <img
            src={pokemon.caught ? "/icons/caught.png" : "/icons/not_caught.png"}
            onClick={handleCaughtClick}
            alt="Capturado"
          />
          <img
            src={pokemon.favorite ? "/icons/favorite.png" : "/icons/not_favorite.png"}
            onClick={handleFavoriteClick}
            alt="Favorito"
          />
        </Menu>
      </HeaderContainer>
      <div
        className="row justify-content-center"
        style={{ position: "relative", paddingBottom: "1rem" }}
      >
        <div className="col-lg-3 col-md-2 bioDiv d-flex flex-wrap justify-content-center">
          <div className="inner">
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td className="text-right font-weight-bold">ID</td>
                  <td># {pokemon.id}</td>
                </tr>
                <tr>
                  <td className="text-right font-weight-bold">Height</td>
                  <td style={{ whiteSpace: "nowrap" }}>{pokemon.height} Mt</td>
                </tr>
                <tr>
                  <td className="text-right font-weight-bold">Weight</td>
                  <td style={{ whiteSpace: "nowrap" }}>{pokemon.weight} Kg</td>
                </tr>
                <tr>
                  <td className="text-right font-weight-bold">Abilities</td>
                  <td>
                    <span className="abilities">
                      {pokemon.abilities.map((ability, index) => (
                        <Badge
                          key={index}
                          className={`ability ${pokemon.types[0]} text-uppercase`}
                          role="button"
                          style={{
                            whiteSpace: "nowrap",
                            display: "inline-block",
                            boxShadow: "none",
                          }}
                        >
                          {ability.ability.name}
                        </Badge>
                      ))}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td
                    className="text-right font-weight-bold"
                    style={{ verticalAlign: "middle" }}
                  >
                    Type
                  </td>
                  <td>
                    <div className="row" style={{ flexWrap: "nowrap" }}>
                      {pokemon.types.map((type, index) => (
                        <Badge
                          key={index}
                          className={`icon ${type} text-capitalize`}
                        >
                          <span className="text-white font-weight-bold">
                            {type}
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-lg-5 d-flex flex-wrap align-items-center">
          <div className="image-container">
            <img
              alt=""
              className="Image img-fluid mx-auto my-auto d-block fadeInOut"
              src={imagePokemon}
              style={{
                zIndex: "100 !important",
                maxWidth: "85%",
                height: "auto",
                paddingTop: "10px",
              }}
            />
          </div>
        </div>

        <div className="col-lg-3 col-md-2 statDiv my-auto mx-auto d-flex flex-wrap justify-content-center">
          <div className="inner">
            <table className="table table-borderless">
              <tbody>
                {pokemon.baseStats.map((stat, index) => (
                  <tr key={index}>
                    <td
                      className="text-right font-weight-bold"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {baseStatsName[index]}
                    </td>
                    <td colSpan={3} style={{ width: "100%" }}>
                      <div className="progress">
                        <Badge
                          className={`progress-bar progress-bar-striped progress-bar-animated rounded-sm ${pokemon.types[0]}`}
                          role="progressbar"
                          aria-valuenow=""
                          aria-valuemin="0"
                          aria-valuemax="255"
                          style={{
                            width: `${stat}%`,
                          }}
                        >
                          <span>{stat}</span>
                        </Badge>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pokemon;
