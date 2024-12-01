/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState, ChangeEvent } from 'react';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Controller, useForm } from 'react-hook-form';
import { authService } from '@/service/AuthService';

// Definimos uma interface para os valores do formulário
interface FormValues {
    name: string;
    email: string;
    password: string;
}

const LoginPage = () => {
    const { layoutConfig } = useContext(LayoutContext);


    const { control, register, handleSubmit } = useForm<FormValues>();

    const router = useRouter();

    const service = new authService();

    const handleCadastrarClick = async (data: any) => {
        // Imprime todos os valores do formulário no console
        try {

            const payload = {...data, role: 'USER'}
            // Envia os dados para o método `register` do serviço
            const response = await service.register(payload);

            console.log('Cadastro realizado com sucesso:', response);

            // Redireciona ou exibe mensagem de sucesso
            router.push('/auth/login');
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
        }
    };

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );


    return (
        <form onSubmit={handleSubmit(handleCadastrarClick)}>
            <div className={containerClassName}>
                <div className="flex flex-column align-items-center justify-content-center">
                    <div
                        style={{
                            borderRadius: '56px',
                            padding: '0.3rem',
                            background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                        }}
                    >
                        <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                            <div className="text-center mb-5">
                                <div className="text-900 text-3xl font-medium mb-3">Cadastre já!</div>
                            </div>

                            <div>
                                <div className="flex flex-column">
                                    <label htmlFor="name" className="block text-900 text-xl font-medium mb-2">
                                        Nome completo
                                    </label>
                                    <InputText
                                        id="name"
                                        type="text"
                                        placeholder="Nome"
                                        className="w-full md:w-30rem mb-5"
                                        style={{ padding: '1rem' }}
                                        {...register('name')}
                                    />

                                    <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                        Email
                                    </label>
                                    <InputText
                                        id="email"
                                        type="text"
                                        placeholder="Email"
                                        className="w-full md:w-30rem mb-5"
                                        style={{ padding: '1rem' }}
                                        {...register('email')}
                                    />
                                </div>

                                <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
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

                                <div className="flex align-items-end justify-content-end mb-5 gap-5">
                                    <a
                                        className="font-medium no-underline ml-2 text-right cursor-pointer"
                                        style={{ color: 'var(--primary-color)' }}
                                        onClick={() => router.push('/auth/login')}
                                    >
                                        Já possui uma conta?
                                    </a>
                                </div>

                                <Button
                                    type='submit'
                                    label="Cadastrar"
                                    className="w-full p-3 text-xl"
                                ></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default LoginPage;
