import React from "react";
import { Router } from "@reach/router";
import "typeface-roboto";

import { CssBaseline, createMuiTheme, ThemeProvider } from "@material-ui/core";

import Boilerplate from "./Boilerplate";
import Home from "./Home";
import Interview from "./Interview";
import NewInterview from "./NewInterview";

const theme = createMuiTheme({
  typography: {
    fontFamily: ['"Montserrat"', "sans-serif"].join(","),
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Boilerplate>
        <Router>
          <Home path="/" />
          <Interview path="/:id" />
          <NewInterview path="/new" />
        </Router>
      </Boilerplate>
    </ThemeProvider>
  );
}
