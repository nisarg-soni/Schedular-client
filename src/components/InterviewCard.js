import React from "react";
import PropTypes from "prop-types";

import {
  makeStyles,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  interviewCard: {
    margin: theme.spacing(3),
    maxWidth: "25rem",
    minHeight: "15rem",
    display: "flex",
  },
}));

export default function InterviewCard({ interview }) {
  const classes = useStyles();
  const start = new Date(interview.start_time);
  const end = new Date(interview.end_time);
  return (
    <Card className={classes.interviewCard} elevation={3}>
      <CardActionArea href={`/${interview.id}`}>
        <CardContent>
          <Typography variant="h5">
            <b>{interview.name}</b>
          </Typography>
          <Typography variant="caption">
            {`${
              interview.date
            } ${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`}
          </Typography>
          <Typography variant="body1">{interview.description}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

InterviewCard.porpTypes = {
  interview: PropTypes.any.isRequired,
};
