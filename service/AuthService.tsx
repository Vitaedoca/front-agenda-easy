import { Demo } from "@/types";
import axios from "axios";

export const axiosInstance = axios.create
({
    baseURL: 'http://localhost:8080/auth',
})


export class authService {

    login(user: Demo.Auth) {
        return axiosInstance.post("/login", user)
    }

    register(user: Demo.Auth) {
        return axiosInstance.post(`/register`, user)    
    }
}
