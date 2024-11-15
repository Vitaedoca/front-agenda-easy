'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

const LandingPage = () => {
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedProfessional, setSelectedProfessional] = useState<any | null>(null);
    const [selectedService, setSelectedService] = useState<string | null>(null);

    // Dados dos profissionais e serviços carregados dinamicamente
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);

    // Função para carregar os profissionais e serviços
    const fetchData = async () => {
        try {
            const professionalResponse = await axios.get('http://localhost:8080/professional');
            setProfessionals(professionalResponse.data); // Atualiza o estado com os profissionais

            const serviceResponse = await axios.get('http://localhost:8080/services');
            setServices(serviceResponse.data); // Atualiza o estado com os serviços
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    // Carregar os dados quando o componente for montado
    useEffect(() => {
        fetchData();
    }, []);

    // Função para gerar os horários em intervalos de 30 minutos das 08:00 às 18:00
    const generateTimes = () => {
        const times = [];
        let startHour = 8; // 08:00
        let endHour = 18; // 18:00
        let minutes = ['00', '30'];

        for (let hour = startHour; hour <= endHour; hour++) {
            for (let minute of minutes) {
                times.push(`${hour.toString().padStart(2, '0')}:${minute}`);
            }
        }
        return times;
    };

    const times = generateTimes();

    // Template para exibir cada horário no carrossel
    const timeTemplate = (time: string) => {
        return (
            <div className="p-card p-fluid p-shadow-2">
                <Button 
                    label={time} 
                    className="p-button-outlined" 
                    onClick={() => setSelectedTime(time)} 
                    style={{ width: '100%' }}
                />
            </div>
        );
    };

    // Função chamada quando o usuário seleciona um dia no calendário
    const onDateChange = (e: any) => {
        setSelectedDate(e.value);  // Atualiza o estado com a data selecionada
        setSelectedTime(null);      // Reseta o horário selecionado
    };

    // Função para realizar o agendamento
    const handleSchedule = async () => {
        if (!selectedDate || !selectedProfessional || !selectedService || !selectedTime) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        const appointmentData = {
            clientId: 1, // ID do cliente (fixo como 1, conforme solicitado)
            professionalId: selectedProfessional.id,
            serviceId: selectedService.id,
            appointmentDate: selectedDate.toLocaleDateString('pt-BR'), // Data no formato "dd/mm/yyyy"
            horario: selectedTime,
            status: 'A', // Status do agendamento
        };

        try {
            await axios.post('http://localhost:8080/appointments', appointmentData);
            alert('Agendamento realizado com sucesso!');
        } catch (error) {
            console.error('Erro ao realizar agendamento:', error);
            alert('Houve um erro ao tentar realizar o agendamento. Tente novamente.');
        }
    };

    return (
        <div className="surface-0 flex justify-content-center flex-column p-4">
            {/* Exibe o calendário para o usuário selecionar a data */}
            <div className="calendar-container mb-4">
                <Calendar 
                    value={selectedDate} 
                    onChange={onDateChange} 
                    inline 
                    showWeek 
                    dateFormat="dd/mm/yy"
                    style={{ width: '100%' }}
                />
            </div>

            {/* Exibe a seleção de profissional */}
            {selectedDate && (
                <div className="mb-4">
                    <Dropdown 
                        value={selectedProfessional} 
                        onChange={(e) => setSelectedProfessional(e.value)} 
                        options={professionals} 
                        optionLabel="name" 
                        placeholder="Selecione o profissional" 
                        className="w-full"
                    />
                </div>
            )}

            {/* Exibe a seleção de serviço */}
            {selectedDate && selectedProfessional && (
                <div className="mb-4">
                    <Dropdown 
                        value={selectedService} 
                        onChange={(e) => setSelectedService(e.value)} 
                        options={services} 
                        optionLabel="name" 
                        placeholder="Selecione o serviço" 
                        className="w-full"
                    />
                </div>
            )}

            {/* Exibe os horários no carrossel apenas se uma data e profissional forem selecionados */}
            {selectedDate && selectedProfessional && selectedService && (
                <div className="mt-4 w-full">
                    <p>Escolha o horário: </p>
                    <Carousel 
                        value={times} 
                        itemTemplate={(time) => timeTemplate(time)} 
                        numVisible={3} 
                        circular 
                    />
                </div>
            )}

            {/* Exibe o horário selecionado */}
            {selectedTime && (
                <div className="mt-3">
                    <h4>Horário selecionado: {selectedTime}</h4>
                    <h5>Profissional: {selectedProfessional?.name}</h5>
                    <h5>Serviço: {selectedService?.label}</h5>
                </div>
            )}

            {/* Botão para realizar o agendamento */}
            <Button 
                className="flex justify-center items-center w-full" 
                onClick={handleSchedule}>
                Realizar agendamento
            </Button>
        </div>
    );
};

export default LandingPage;
