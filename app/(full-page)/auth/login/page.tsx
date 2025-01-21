/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Controller, useForm } from 'react-hook-form';
import { authService } from '@/service/AuthService';
import Cookies from 'js-cookie';
import { Toast } from 'primereact/toast';
import { jwtDecode } from 'jwt-decode';


const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();


    interface formValues {
        email: string,
        password: string
    }

    const {control, register, handleSubmit, reset} = useForm<formValues>();

    const service = new authService();

    const toast = useRef<Toast>(null);

    const loginHandle = async (data: formValues) => {
        try {
            // Envia os dados para o método `login` do serviço
            const response = await service.login(data);
    
            const token = response.data.token;
    
            // Decodifica o token para extrair a role
            const decodedToken: { role: string } = jwtDecode(token);
    
            Cookies.set("auth_token", token, { expires: 7 });
    
            // Redireciona com base na role
            if (decodedToken.role === 'ADMIN') {
                router.push('/');
            } else if (decodedToken.role === 'USER') {
                router.push('/landing');
            }
    
            // Recarrega a página para atualizar o estado do aplicativo
            window.location.reload();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Login ou senha estão inválidos!'
            });
    
            reset({
                email: '',
                password: ''
            });
        }
    };

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <form onSubmit={handleSubmit(loginHandle)}>
            <Toast ref={toast}/>
            <div className={containerClassName}>
                <div className="flex flex-column align-items-center justify-content-center">
                    {/* <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" /> */}
                    <div
                        style={{
                            borderRadius: '56px',
                            padding: '0.3rem',
                            background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                        }}
                    >
                        <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                            <div className="text-center mb-5">
                                {/* <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" /> */}
                                <div className="text-900 text-3xl font-medium mb-3">Seja bem vindo!</div>
                                <span className="text-600 font-medium">Digite seu e-mail e senha</span>
                            </div>

                            <div>
                                <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                    Email
                                </label>
                                <InputText id="email1" type="text" placeholder="Email" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} {...register("email")}/>

                                <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                    Senha
                                </label>
                                <Controller
                                    name="password"
                                    control={control} // Conecta o formulário
                                    defaultValue=""   // Define o valor inicial
                                    render={({ field }) => (
                                        <Password
                                            id="password"
                                            placeholder="Senha"
                                            toggleMask
                                            className="w-full mb-5"
                                            inputClassName="w-full p-3 md:w-30rem"
                                            {...field} // Conecta o campo ao form
                                        />
                                    )}
                                />

                                <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                    <div className="flex align-items-center">
                                        <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                        <label htmlFor="rememberme1">Remember me</label>
                                    </div>
                                    <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                        Esqueceu a senha?
                                    </a>
                                </div>
                                <Button type='submit' label="Logar" className="w-full p-3 text-xl"></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default LoginPage;
