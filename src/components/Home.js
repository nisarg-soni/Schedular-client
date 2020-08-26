import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";

import {
  CircularProgress,
  Container,
  Fab,
  Grid,
  makeStyles,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import InterviewCard from "./InterviewCard";
import { getInterviews } from "../api";

const useStyles = makeStyles({
  fab: {
    margin: 0,
    top: "auto",
    right: 20,
    bottom: 20,
    left: "auto",
    position: "fixed",
  },
});

export default function Home() {
  const classes = useStyles();
  const [interviews, setInterviews] = useState(null);
  useEffect(() => {
    getInterviews().then((interviews) => setInterviews(interviews));
  }, []);

  const getGridItems = () =>
    interviews.map((interview) => (
      <Grid item lg={3} key={interview.id}>
        <InterviewCard interview={interview} />
      </Grid>
    ));

  if (!interviews) return <CircularProgress />;

  return (
    <Container>
      <Grid container justify="space-evenly">
        {getGridItems()}
      </Grid>
      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        component={Link}
        to="/new"
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}
