import axios from "axios"
import Cookies from 'js-cookie'


const instance = axios.create({
    baseURL: 'https://localhost:5001/api/',
});



if(Cookies.get('User')){
    instance.defaults.headers.common['Authorization'] = JSON.parse(Cookies.get('User')).Token;
}


 export default  instance