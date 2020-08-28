import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';

import { makeStyles, Card, CardActionArea, CardContent, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	interviewCard: {
		margin: theme.spacing(3),
		maxWidth: '30rem',
		minHeight: '25rem',
		display: 'flex'
	}
}));

export default function InterviewCard({ interview }) {
	const classes = useStyles();
	const start = new Date(interview.start_time);
	const end = new Date(interview.end_time);

	const candidateItems = () =>
		interview.participants.map((one) => {
			if (one.is_candidate) {
				return <ListGroup.Item>{one.name}</ListGroup.Item>;
			}
		});

	const interviewerItems = () =>
		interview.participants.map((one) => {
			if (!one.is_candidate) {
				return <ListGroup.Item>{one.name}</ListGroup.Item>;
			}
		});

	return (
		<Card className={classes.interviewCard} style={{ fontFamily: "'Montserrat', sans-serif" }} elevation={3}>
			<CardActionArea href={`/${interview.id}`}>
				<CardContent>
					<Typography variant="h5" style={{ margin: '10px' }}>
						<b>{interview.name}</b>
					</Typography>
					<Typography variant="caption" style={({ marginTop: '10px' }, { fontSize: '1rem' })}>
						{`${interview.date}`}
					</Typography>
					<br />
					<Typography variant="caption" style={({ marginTop: '10px' }, { fontSize: '1rem' })}>
						{` ${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`}
					</Typography>
					<br />
					<Typography variant="caption" style={{ marginTop: 20 + 'px' }}>
						Description :
					</Typography>
					<Typography
						variant="body1"
						className="block-example border border-dark"
						style={({ marginTop: '10px' }, { padding: '0.5rem' })}
					>
						{interview.description}
					</Typography>
					<br />
					<Typography variant="caption">Candidates :</Typography>
					<ListGroup style={{ marginTop: '10px' }}>{candidateItems()}</ListGroup>
					<Typography variant="caption">Interviewers :</Typography>
					<ListGroup style={{ marginTop: '10px' }}>{interviewerItems()}</ListGroup>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}

InterviewCard.porpTypes = {
	interview: PropTypes.any.isRequired
};
