const DB_FILE_NAME = './database.txt'
const API_BASE = 'https://api.miro.com/v1'
const BASE_URL = 'https://ailurusweb.github.io/miro-dice' 
const CLIENT_ID = '1004457346318492837' 
const CLIENT_SECRET = '5KSBs8DHnqKMq87iuybci' 
const WEBHOOKS_VERIFICATION_TOKEN = ''

const axios = require('axios').default;

/* const oAuth = {
	getToken(code, clientId) {
		const uri = `${config.API_BASE}/oauth/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${
			config.CLIENT_SECRET
		}&code=${code}&redirect_uri=${config.BASE_URL}/oauth`
		const options = {method: 'POST', uri: uri}
		return rp(options)
			.then(res => JSON.parse(res))
			.catch((error) => {
				logError(options)
				throw error
			})
	}
} */