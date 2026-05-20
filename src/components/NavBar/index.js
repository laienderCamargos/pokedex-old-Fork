import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { NavBarStyles, BackContainer, TitleContainer, TemaContainer } from "./styles";
import { ThemeContext } from "../../providers/theme";

const NavBar = () => {
  const { toggleTheme, theme } = useContext(ThemeContext);

  return (
    <NavBarStyles className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top ">
      <BackContainer>
        <Link to="/">
          <h2>
            <i className="arrow circle left icon" />
          </h2>
        </Link>
      </BackContainer>
      <TitleContainer className="title-container">
        <div>
          <h1>Escolha seu Pokemon</h1>
        </div>

      </TitleContainer>
      <TemaContainer onClick={toggleTheme}>
        <img
          src={theme === "#000" ? "/icons/escuro.png" : "/icons/Claro.png"}
          alt="Tema"
        />
      </TemaContainer>
    </NavBarStyles>
  );
};

export default NavBar;
