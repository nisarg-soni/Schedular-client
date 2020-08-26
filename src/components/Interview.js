import React, { useState, useEffect } from 'react';
import { getInterview, getParticipants, postModifyInterview, deleteInterview } from '../api';
import Notifier, { openSnackbar } from './Notifier';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, TextField, Button, Container, CircularProgress, Fab } from '@material-ui/core';
import { MuiThemeProvider } from 'material-ui/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

// Basic styling
const useStyles = makeStyles((theme) => ({
	input: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2)
		},
		marginTop: theme.spacing(3)
	},
	timeField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: 200
	},
	textField: {
		width: '100%'
	},
	fabContainer: {
		margin: 0,
		top: 'auto',
		right: 20,
		bottom: 20,
		left: 'auto',
		position: 'fixed'
	},
	fab: {
		margin: '0.3rem'
	}
}));

export default function Interview({ id }) {
	const [ interview, setInterview ] = useState(null);
	const classes = useStyles();
	const [ name, setName ] = useState('');
	const [ description, setDescription ] = useState('');
	const [ candOpt, setCandOpt ] = useState([]);
	const [ candidates, setCandidates ] = useState([]);
	const [ interOpt, setInterOpt ] = useState([]);
	const [ interviewers, setInterviewers ] = useState([]);
	const [ date, setDate ] = useState('');
	const [ startTime, setStartTime ] = useState('');
	const [ endTime, setEndTime ] = useState('');
	const [ disable, setDisable ] = useState(true);

	useEffect(
		() => {
			getInterview(id).then((interview) => {
				setInterview(interview);
				setName(interview.name);
				setDescription(interview.description);
				setCandidates(interview.candidates);
				setInterviewers(interview.interviewers);
				setDate(interview.date);

				// format start and end times to utc for database.
				let start = new Date(interview.start_time);
				let end = new Date(interview.end_time);
				start = start.toLocaleTimeString();
				end = end.toLocaleTimeString();
				if (start[1] === ':') start = '0' + start;
				if (end[1] === ':') end = '0' + end;
				setStartTime(start.slice(0, 5));
				setEndTime(end.slice(0, 5));
			});
		},
		[ id ]
	);
	if (!interview) return <CircularProgress />;

	// update candidates
	async function updateCandOpts(event, value, reason) {
		if (value.length !== 1) return;
		setCandOpt(await getParticipants({ query: value.toLowerCase(), role: 1 }));
	}

	// update interviewers
	async function updateInterOpts(event, value, reason) {
		if (value.length !== 1) return;
		setInterOpt(await getParticipants({ query: value.toLowerCase(), role: 0 }));
	}

	// Name of the interview.
	const nameField = (
		<TextField
			required
			id="name"
			label="Name"
			className={classes.textField}
			onChange={(event) => setName(event.target.value)}
			value={name}
			disabled={disable}
		/>
	);

	// Description
	const descriptionField = (
		<TextField
			id="description"
			label="Description"
			className={classes.textField}
			multiline
			rows={4}
			onChange={(event) => setDescription(event.target.value)}
			value={description}
			disabled={disable}
		/>
	);

	// Candidates
	const candidateField = (
		<Autocomplete
			multiple
			filterSelectedOptions
			id="candidates"
			size="small"
			options={candOpt}
			getOptionLabel={(option) => option.name}
			getOptionSelected={(option, value) => option.id === value.id}
			onInputChange={updateCandOpts}
			onChange={(evt, value) => setCandidates(value)}
			renderInput={(params) => (
				<TextField {...params} variant="standard" label="Select Candidates" placeholder="candidates" />
			)}
			value={candidates}
			disabled={disable}
		/>
	);

	// Interviewers
	const interviewerField = (
		<Autocomplete
			multiple
			filterSelectedOptions
			id="interviewer"
			size="small"
			options={interOpt}
			getOptionLabel={(option) => option.name}
			getOptionSelected={(option, value) => option.id === value.id}
			onInputChange={updateInterOpts}
			onChange={(evt, value) => setInterviewers(value)}
			renderInput={(params) => (
				<TextField {...params} variant="standard" label="Select Interviewers" placeholder="Interviewers" />
			)}
			value={interviewers}
			disabled={disable}
		/>
	);

	// Date
	const dateField = (
		<TextField
			required
			id="date"
			label="Date"
			type="date"
			className={classes.timeField}
			InputLabelProps={{
				shrink: true
			}}
			onChange={(event) => setDate(event.target.value)}
			value={date}
			disabled={disable}
		/>
	);

	// Start time
	const startTimeField = (
		<TextField
			required
			id="start-time"
			label="Start Time"
			type="time"
			className={classes.timeField}
			InputLabelProps={{
				shrink: true
			}}
			onChange={(event) => setStartTime(event.target.value)}
			value={startTime}
			disabled={disable}
		/>
	);

	// End time
	const endTimeField = (
		<TextField
			required
			id="end-time"
			label="End Time"
			type="time"
			className={classes.timeField}
			InputLabelProps={{
				shrink: true
			}}
			onChange={(event) => setEndTime(event.target.value)}
			value={endTime}
			disabled={disable}
		/>
	);

	// Triggered on submit
	async function formSubmit(event) {
		event.preventDefault();
		// use start_time.toISOString() to convert to the required format
		const start_time = new Date(date + ' ' + startTime);
		const end_time = new Date(date + ' ' + endTime);

		//Set time to utc for database purposes.
		const start_str = `${start_time.getUTCHours() < 10
			? '0' + start_time.getUTCHours()
			: String(start_time.getUTCHours())}:${start_time.getUTCMinutes() < 10
			? '0' + start_time.getUTCMinutes()
			: String(start_time.getUTCMinutes())}`;
		const end_str = `${end_time.getUTCHours() < 10
			? '0' + end_time.getUTCHours()
			: String(end_time.getUTCHours())}:${end_time.getUTCMinutes() < 10
			? '0' + end_time.getUTCMinutes()
			: String(end_time.getUTCMinutes())}`;
		if (!interviewers.length) {
			openSnackbar({ message: 'Interviewer is empty' });
		} else if (!candidates.length) {
			openSnackbar({ message: 'Candidates is empty' });
		} else if (end_time.getTime() <= start_time.getTime()) {
			openSnackbar({ message: 'Interview can not start after it ends.' });
		} else {
			const inter = interviewers.map((one) => {
				return one.id;
			});

			const candid = candidates.map((one) => {
				return one.id;
			});

			const details = {
				id,
				name,
				description,
				date,
				start: start_str,
				end: end_str,
				interviewers: inter,
				candidates: candid
			};
			let result;

			try {
				result = await postModifyInterview(details);
			} catch (error) {
				console.log(error);
				openSnackbar({ message: 'Error has occured.' });
			}

			if (result.status === 'SUCCESS') {
				openSnackbar({ message: 'Successful, redirecting to Home...' });
				//redirect to home.

				setTimeout(() => {
					window.location = '/';
				}, 1000);
			} else {
				openSnackbar({
					message: 'Interview is overlapping with a previous interview.'
				});
			}
		}
	}

	async function onDelete() {
		let result = await deleteInterview(id);
		if (result.status === 'SUCCESS') {
			openSnackbar({ message: 'Deleted, redirecting to Home...' });
			//redirect to home.

			setTimeout(() => {
				window.location = '/';
			}, 1000);
		} else {
			openSnackbar({ message: 'There was some error while deleting' });
		}
	}

	return (
		<Container>
			<MuiThemeProvider>
				<Notifier />
				<form className={classes.input} onSubmit={formSubmit}>
					{nameField}
					{descriptionField}
					{candidateField}
					{interviewerField}
					{dateField}
					{startTimeField}
					{endTimeField}
					<br />
					<Button
						variant="contained"
						color="primary"
						type="submit"
						disabled={disable}
						style={{ maxWidth: '8rem' }}
					>
						Submit
					</Button>
				</form>
				<div className={classes.fabContainer}>
					<Fab
						className={classes.fab}
						color="secondary"
						aria-label="edit"
						onClick={() => setDisable(!disable)}
					>
						<EditIcon />
					</Fab>
					<Fab className={classes.fab} color="secondary" aria-label="edit" onClick={onDelete}>
						<DeleteIcon />
					</Fab>
				</div>
			</MuiThemeProvider>
		</Container>
	);
}
