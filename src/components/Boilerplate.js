import React from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import {
  AppBar,
  Container,
  Toolbar,
  Slide,
  Typography,
  makeStyles,
  useScrollTrigger,
} from "@material-ui/core";

const useStyle = makeStyles({
  a: {
    color: "white",
    textDecoration: "none",
  },
});

const HideOnScroll = ({ children }) => {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

export default function Boilerplate(props) {
  const classes = useStyle();
  return (
    <>
      <HideOnScroll>
        <AppBar>
          <Toolbar>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              className={classes.a}
            >
              Interview Scheduler
            </Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Container>{props.children}</Container>
    </>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
};

Boilerplate.propTypes = {
  children: PropTypes.element.isRequired,
};
