import { Demo } from "@/types";
import axios from "axios";

export const axiosInstance = axios.create
({
    baseURL: 'http://localhost:8080',
})


export class appointmentsService {
    listarTodos() {
        return axiosInstance.get('/appointments')
    }

    // inserir(professional: Demo.Professional) {
    //     return axiosInstance.post("/appointments", professional)
    // }

    // editar(professional: Demo.Professional) {
    //     return axiosInstance.put(`/appointments/${professional.id}`, professional)    
    // }

    // deletar(professional: Demo.Professional) {
    //     return axiosInstance.delete(`/appointments/${professional.id}`); 
    // }
}
