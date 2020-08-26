import axios from 'axios';

// const baseurl = 'http://localhost:3000/api/v1';
// http://localhost:3000/api/v1
const baseurl = 'https://fierce-hamlet-68811.herokuapp.com/api/v1';

// API call to fetch all interviews
export async function getInterviews() {
	const url = baseurl + '/interviews';
	const { data } = await axios.get(url).then((res) => res.data);

	return data;
}

// API call to fetch single interviews
export async function getInterview(interviewId) {
	const url = baseurl + `/interviews/${interviewId}`;
	const { data } = await axios.get(url).then((res) => res.data);

	return data;
}

// API call to create new interview
export async function postNewInterview(interviewDetails) {
	const url = baseurl + `/interviews`;
	const { data } = await axios
		.post(url, {
			name: interviewDetails.name,
			description: interviewDetails.description,
			date: interviewDetails.date,
			start_time: interviewDetails.start,
			end_time: interviewDetails.end,
			interviewers: interviewDetails.interviewers,
			candidates: interviewDetails.candidates
		})
		.then((res) => res);

	return data;
}

// API call to modify interview
export async function postModifyInterview(interviewDetails) {
	const url = baseurl + `/interviews/${interviewDetails.id}`;
	const { data } = await axios
		.patch(url, {
			name: interviewDetails.name,
			description: interviewDetails.description,
			date: interviewDetails.date,
			start_time: interviewDetails.start,
			end_time: interviewDetails.end,
			interviewers: interviewDetails.interviewers,
			candidates: interviewDetails.candidates
		})
		.then((res) => res);

	return data;
}

// API call to get participants list
export async function getParticipants(details) {
	const url = baseurl + `/participants/${details.query}/${details.role}`;
	const { data } = await axios.get(url).then((res) => res.data);
	return data;
}

// API call to delete interview
export async function deleteInterview(interviewId) {
	const url = baseurl + `/interviews/${interviewId}`;
	const { data } = await axios.delete(url);
	return data;
}
