import axios from "axios";

const AxiosService = axios.create({
    baseURL:import.meta.env.VITE_BASE_URL,
    headers:{
        "Content-Type":"application/json"
    }
})

AxiosService.interceptors.request.use(config=>{
    return config
},error=>{Promise.reject(error)})

AxiosService.interceptors.response.use(response=>{
    return response.data
},error=>{Promise.reject(error)})

export default AxiosService