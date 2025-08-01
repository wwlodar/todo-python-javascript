import config from "./config"
import axios from 'axios';

import jwtDecode from "jwt-decode"
import * as moment from "moment"


// every request is intercepted and has auth header injected.
function localStorageTokenInterceptor(config) {
	const tokenString = localStorage.getItem("token")

	if (tokenString) {
		const token = tokenString
		const decodedAccessToken = jwtDecode(token)
		const isAccessTokenValid =
			moment.unix(decodedAccessToken.exp).toDate() > new Date()
		if (isAccessTokenValid) {
			config["headers"]["Authorization"] = `Bearer ${token}`
		} else {
			alert('Your login session has expired')
			localStorage.removeItem("token")
			window.location.reload()
		}
	}
	return config
}

class FastAPIClient {
	constructor(overrides) {
		this.config = {
			...config,
			...overrides,
		}

		this.apiClient = this.getApiClient(this.config)
	}

	/* Create Axios client instance pointing at the REST api backend */
	getApiClient(config) {
		let initialConfig = {
			baseURL: `${config.apiBasePath}/api/v1`,
			headers: {
				// "Content-type": "application/json",
				"Access-Control-Allow-Headers": "*",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			},

		}

		const client = axios.create(initialConfig);
		client.interceptors.request.use(localStorageTokenInterceptor)
		return client
	}

	register(email, password, username) {
		const registerData = {
			email:email,
			password:password,
			username: username,
		}

		return this.apiClient.post("/register", registerData).then(
			(resp) => {
				return resp.data
		})
	}

	login(username, password) {
		delete this.apiClient.defaults.headers["Authorization"]

		// Generate form data for submission
		const form_data = new URLSearchParams()
		form_data.append("grant_type", "password")
		form_data.append("username", username)
		form_data.append("password", password)

		return this.apiClient
			.post("/login", form_data)
			.then((resp) => {
				return resp.data
			})
	}

	logout() {
		return this.apiClient
		.post("/logout")
		.then((resp) => {
			return resp.data
		})
	}
	// Events
	createEvent(title, date){
		const form_data = { title, date };
		return this.apiClient
			.post("/events", form_data)
			.then((resp) => {
				return resp.data
			})
	}

	getEvents() {
		return this.apiClient.get('/events').then(({data}) => {
			return data
		})
	}

	getEventById(eventId) {
		return this.apiClient.get('/events/' + eventId).then(({data}) => {
			return data
		})
	}

	updateEvent(title, eventId) {
		const form_data = { title };
		return this.apiClient
			.put("/events/" + eventId, form_data)
			.then((resp) => {
				return resp.data
			})
	}

	// Notes
	getNotes() {
		return this.apiClient.get('/notes').then(({data}) => {
			return data
		}
		)
	}

	createNote(title) {
		const form_data = { title };
		return this.apiClient
			.post("/notes", form_data)
			.then((resp) => {
				return resp.data
			})
	}
	getNoteById(noteId) {
		return this.apiClient.get('/notes/' + noteId).then(({data}) => {
			return data
		})
	}
	updateNote(noteId, title) {
		const form_data = { title };
		return this.apiClient
			.put("/notes/" + noteId, form_data)
			.then((resp) => {
				return resp.data
			})
	}



	fetchUser() {
		return this.apiClient.get("/user").then(({data}) => {
			localStorage.setItem("user", JSON.stringify(data))
			return data
		})
	}

	}

const fastapiclient = new FastAPIClient(config);

export {fastapiclient};