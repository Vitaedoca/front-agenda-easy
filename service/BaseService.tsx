import axios from "axios";
import Cookies from "js-cookie";
import { Router, useRouter } from "next/router";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080'
})


export class BaseService{

    url: string;

    constructor(url: string){
        this.url = url;

        axiosInstance.interceptors.request.use((config) => {
            const token = Cookies.get('auth_token');          
            const authRequestToken = token ? `Bearer ${token}` : '';
            config.headers['Authorization'] = authRequestToken;
            return config;
        },
            (error) => Promise.reject(error)
        );

        axiosInstance.interceptors.response.use((response) => {            
            return response;
        }, async (erro) => {
            const originalConfig = erro.config;          
            console.log(erro.response.status);
            if (erro.response.status == 401) {
                Cookies.remove('auth_token');
                window.location.reload();         
            }
            return Promise.reject(erro);
        });

    }

    listarTodos(){
        return axiosInstance.get(this.url);
    }

    inserir(objeto: any){
        return axiosInstance.post(this.url, objeto);
    }

    editar(objeto : any){
        return axiosInstance.put(`${this.url}/${objeto.id}`, objeto);
    }

    deletar(id : number){
        return axiosInstance.delete(this.url + "/" + id);
    }
}