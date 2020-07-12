import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ctmapi.herokuapp.com/',
});

export default api;
