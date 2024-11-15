import { Demo } from "@/types";
import axios from "axios";

export const axiosInstance = axios.create
({
    baseURL: 'http://localhost:8080',
})


export class serviceService {
    listarTodos() {
        return axiosInstance.get('/services')
    }

    inserir(services: Demo.Services) {
        return axiosInstance.post("/services", services)
    }

    editar(professional: Demo.Services) {
        return axiosInstance.put(`/services/${professional.id}`, professional)    
    }

    deletar(professional: Demo.Services) {
        return axiosInstance.delete(`/services/${professional.id}`); 
    }
}
