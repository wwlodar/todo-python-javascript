import config from "./config"
import axios from 'axios';

import jwtDecode from "jwt-decode"
import * as moment from "moment"


// every request is intercepted and has auth header injected.
function localStorageTokenInterceptor(config) {
	let headers = {}
	const tokenString = localStorage.getItem("token")

	if (tokenString) {
		const token = tokenString
		const decodedAccessToken = jwtDecode(token)
		const isAccessTokenValid =
			moment.unix(decodedAccessToken.exp).toDate() > new Date()
		if (isAccessTokenValid) {
			headers["Authorization"] = `Bearer ${token}`
		} else {
			alert('Your login session has expired')
			localStorage.removeItem("token")

		}
	}
	config["headers"] = headers
	return config
}
// {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3d3d3dyIsImV4cCI6MTczNTQ3NDY1MH0.Zf21cX_x3L4_MpNJMgYk21KkoCFXO2nC_VkZoB49WkQ
 //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3d3d3dyIsImV4cCI6MTczNTQ3NTUyMH0.QRZ8FVIz8-MdTr_a-t2sAmI__2PQ7sHLntBKTVf5ONA


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
				"Content-type": "application/json",
				"Access-Control-Allow-Headers": "*",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "*",
			},

		}

		const client = axios.create(initialConfig);
		client.interceptors.request.use(localStorageTokenInterceptor)
		return client
	}

	getEventById(eventId) {
		return this.apiClient.get('/event/' + eventId).then(({data}) => {
			return data
		})
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
		var form_data = new FormData()
		const grant_type = "password"
		const item = {grant_type, username, password}
		for (var key in item) {
			form_data.append(key, item[key])
		}

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

	createEvent(title, date){
		var form_data = new FormData()
		const item = {title, date}
		for (var key in item) {
			form_data.append(key, item[key])
		}
		console.log(form_data)

		return this.apiClient
			.post("/events", form_data)
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