import { Demo } from "@/types";
import axios from "axios";

export const axiosInstance = axios.create
({
    baseURL: 'http://localhost:8080',
})


export class professionalService {
    listarTodos() {
        return axiosInstance.get('/professional')
    }

    inserir(professional: Demo.Professional) {
        return axiosInstance.post("/professional", professional)
    }

    editar(professional: Demo.Professional) {
        return axiosInstance.put(`/professional/${professional.id}`, professional)    
    }

    deletar(professional: Demo.Professional) {
        return axiosInstance.delete(`/professional/${professional.id}`); 
    }
}
