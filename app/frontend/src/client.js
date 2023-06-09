import config from "./config"
import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import jwtDecode from "jwt-decode"
import * as moment from "moment"


// every request is intercepted and has auth header injected.
function localStorageTokenInterceptor(config) {
	let headers = {}
	const tokenString = localStorage.getItem("token")

	if (tokenString) {
		const token = JSON.parse(tokenString)
		const decodedAccessToken = jwtDecode(token.access_token)
		const isAccessTokenValid =
			moment.unix(decodedAccessToken.exp).toDate() > new Date()
		if (isAccessTokenValid) {
			headers["Authorization"] = `Bearer ${token.access_token}`
		} else {
			alert('Your login session has expired')
		}
	}
	config["headers"] = headers
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
		const loginData = {
			email,
			password,
			username: username,
			is_active: true,
		}

		return this.apiClient.post("/register", loginData).then(
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
			.post("/token", form_data)
			.then((resp) => {
				localStorage.setItem("token", JSON.stringify(resp.data))
				return this.fetchUser()
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