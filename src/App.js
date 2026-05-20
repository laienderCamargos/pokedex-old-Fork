import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeContext } from "./providers/theme";
import { PokemonProvider } from "./providers/pokemon";

import Pokedex from "./pages/Pokedex";
// import Home from "./pages/Home";
import Pokemon from "./pages/Pokemon";

function App() {
  return (
    <PokemonProvider>
      <BrowserRouter>
        <ThemeContext.Consumer>
          {({ theme, toggleTheme }) => (
            <div style={{ backgroundColor: theme }}>

              <Routes>
                <Route path="/" element={<Pokedex />} />
                <Route path="/pokedex" element={<Pokedex />} />
                <Route path="/pokemon/:pokemonIndex" element={<Pokemon />} />
              </Routes>
            </div>
          )}
        </ThemeContext.Consumer>
      </BrowserRouter>
    </PokemonProvider>
  );
}

export default App;
