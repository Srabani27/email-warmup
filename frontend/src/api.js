import axios from 'axios';
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export const startOne = () => API.post('/start-one');
export const getLogs = () => API.get('/logs');
export const addAccount = (acc) => API.post('/accounts', acc);
