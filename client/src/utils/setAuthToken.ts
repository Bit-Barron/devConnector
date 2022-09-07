import axios from 'axios';

const setAuthToken = (token: string | number | boolean) => {
    if(token) {
        axios.defaults.headers.common['x-auth-token'] = token;

    } else {
        delete axios.defaults.headers.common['x-auth-token']
    }
}

export default setAuthToken;