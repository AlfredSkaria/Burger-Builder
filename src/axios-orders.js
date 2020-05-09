import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-f58f3.firebaseio.com/'
});

export default instance;