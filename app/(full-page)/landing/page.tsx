'use client';
import { addLocale } from 'primereact/api';
import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import axios from 'axios';
import ServiceComponent from '../components/services';
import ProfessionalComponent from '../components/professional';

import 'pure-react-carousel/dist/react-carousel.es.css';
import { Dialog } from 'primereact/dialog';

const LandingPage = () => {
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedProfessional, setSelectedProfessional] = useState<any | null>(null);
    const [selectedService, setSelectedService] = useState<any | null>(null);

    const [professionals, setProfessionals] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);


    // Função para carregar serviços
    const fetchServices = async () => {
        try {
            const serviceResponse = await axios.get('http://localhost:8080/specialties');
            setServices(serviceResponse.data);
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
        }
    };

    // Função para carregar profissionais com base no serviço selecionado
    const fetchProfessionalsByService = async (serviceId: number) => {
        try {
            const response = await axios.get(`http://localhost:8080/professional/service/${serviceId}`);
            setProfessionals(response.data);
        } catch (error) {
            console.error('Erro ao carregar profissionais:', error);
        }
    };

    // Função para carregar horários disponíveis
    const fetchAvailableTimes = async () => {
        if (!selectedDate || !selectedProfessional) return;

        try {
            const response = await axios.get(
                `http://localhost:8080/appointments/available-times?professionalId=${selectedProfessional.id}&date=${selectedDate.toISOString().split('T')[0]}`
            );
            setAvailableTimes(response.data);
        } catch (error) {
            console.error('Erro ao carregar horários disponíveis:', error);
        }
    };

    // Atualizar horários disponíveis sempre que filtros mudarem
    useEffect(() => {
        if (selectedDate && selectedProfessional) {
            fetchAvailableTimes();
        }
    }, [selectedDate, selectedProfessional]);

    // Carregar serviços ao montar o componente
    useEffect(() => {
        fetchServices();
    }, []);

    // Atualizar profissionais sempre que o serviço selecionado mudar
    useEffect(() => {
        if (selectedService) {
            fetchProfessionalsByService(selectedService.id);
        } else {
            setProfessionals([]);
        }
    }, [selectedService]);

    const onDateChange = (e: any) => {
        setSelectedDate(e.value);
        setSelectedTime(null);
    };

    // Função para calcular o timeEnd baseado no timeStart (adicionando 30 minutos)
    const calculateEndTime = (timeStart: string): string => {
        const [hours, minutes] = timeStart.split(':').map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);
    
        // Adicionar 30 minutos
        startDate.setMinutes(startDate.getMinutes() + 30);
    
        // Formatar a data para o formato HH:mm
        const endHours = String(startDate.getHours()).padStart(2, '0');
        const endMinutes = String(startDate.getMinutes()).padStart(2, '0');
        return `${endHours}:${endMinutes}`;
    };

    const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Os meses começam do 0, por isso +1
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
};
    
const handleSchedule = async () => {
    if (!selectedDate || !selectedProfessional || !selectedService || !selectedTime) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    // Iniciar carregamento
    setIsLoading(true);

    // Calcular timeStart e timeEnd
    const timeStart = selectedTime;
    const timeEnd = calculateEndTime(selectedTime);

    const formattedDate = selectedDate ? formatDate(selectedDate) : '';

    const appointmentData = {
        userId: 2, // Ajuste conforme necessário
        professionalId: selectedProfessional.id,
        serviceId: selectedService.id,
        appointmentDate: formattedDate, // Usar a data formatada
        timeStart: timeStart,
        timeEnd: timeEnd,
        status: 'A', // Status sempre será "A"
    };

    console.log(appointmentData);

    try {
        // Simular delay de 3 segundos
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Realizar o POST no servidor
        await axios.post('http://localhost:8080/appointments', appointmentData);
        setIsSuccess(true); 
        fetchAvailableTimes();
        setSelectedService(null);
        setSelectedProfessional(null);
    } catch (error) {
        console.error('Erro ao realizar agendamento:', error);
        alert('Erro ao tentar realizar o agendamento.');
    } finally {
        // Finalizar carregamento
        setIsLoading(false);
    }
};



    addLocale('pt-BR', {
        firstDayOfWeek: 0, // Domingo como primeiro dia da semana
        dayNames: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
        dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
        dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        monthNames: [
            'janeiro',
            'fevereiro',
            'março',
            'abril',
            'maio',
            'junho',
            'julho',
            'agosto',
            'setembro',
            'outubro',
            'novembro',
            'dezembro',
        ],
        monthNamesShort: [
            'jan',
            'fev',
            'mar',
            'abr',
            'mai',
            'jun',
            'jul',
            'ago',
            'set',
            'out',
            'nov',
            'dez',
        ],
        today: 'Hoje',
        clear: 'Limpar',
    });

    // Exibir o Dialog com o resumo do agendamento
    const showDialog = () => {
        if (!selectedDate || !selectedProfessional || !selectedService || !selectedTime) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        setDialogVisible(true);
    };


    return (
        <div>
            <div
                className="bg-no-repeat bg-cover z-0 rounded-xl overflow-hidden"
                style={{
                    width: '100%',
                    height: '25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'end',
                    paddingBottom: '40px',
                    backgroundImage: "url('/layout/images/image-principal.png')",
                }}
            >
                <div
                    style={{
                        backgroundColor: 'var(--green-400)',
                        padding: '5px',
                        display: 'flex',
                        justifyContent: 'center',
                        maxWidth: '85px',
                        marginLeft: '28px',
                        color: 'white',
                        borderRadius: '5px',
                    }}
                >
                    ABERTO
                </div>
                <h1 className="ml-5 text-3xl font-bold text-white">Salão corte certo</h1>
                <p className="ml-5 text-xl text-white">Porto Alegre • 5.2kms</p>
            </div>

            <div className="surface-0 flex justify-content-center flex-column p-4">
                <h4>Escolha um serviço</h4>
                <div className="flex flex-column gap-3">
                    {services.map((service) => (
                        <ServiceComponent
                            key={service.id}
                            name={service.name}
                            price={service.price}
                            duration={service.duration}
                            isSelected={selectedService?.id === service.id}
                            onSelect={() => setSelectedService(service)}
                        />
                    ))}
                </div>

                {selectedService && (
                    <>
                        <h4>Profissionais disponíveis</h4>
                        <div className="flex flex-wrap gap-3" style={{marginTop: '15px'}}>
                            {professionals.map((professional) => (
                                <ProfessionalComponent
                                    key={professional.id}
                                    name={professional.name}
                                    isSelected={selectedProfessional?.id === professional.id}
                                    onSelect={() => setSelectedProfessional(professional)}
                                />
                            ))}
                        </div>
                    </>
                )}

                <h4>Escolha uma data</h4>
                <Calendar style={{marginTop: '15px'}} locale="pt-BR" value={selectedDate} onChange={onDateChange} inline dateFormat="dd/mm/yy" />

                {selectedDate && selectedProfessional && selectedService && (
                <>
                    <h4>Horários disponíveis</h4>

                    {availableTimes.length > 0 ? (
                        <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px'}}>
                            {availableTimes.map((time, index) => (
                                <Button
                                    key={index}
                                    label={time}
                                    className="p-button-outlined"
                                    onClick={() => setSelectedTime(time)}
                                    style={{
                                        width: '120px',
                                        color: 'black',
                                        fontWeight: 'normal',
                                        fontFamily: 'inherit',
                                        border: '0.5px solid #dcdcdc',
                                        borderRadius: '5px',
                                        marginBottom: '10px', // Espaçamento entre os botões
                                        textAlign: 'center',
                                        backgroundColor: selectedTime === time ? 'rgba(83,83,236, 0.2)' : 'transparent'
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <p>Não há horários disponíveis para essa data.</p>
                    )}
                </>
            )}

            <Button style={{background: 'var(--green-400)', border: 'none'}} label="Agendar" className="w-full mt-4" onClick={showDialog} />

            <Dialog
                style={{width: '300px', height:'300px'}}
                header={isSuccess ? "Agendamento realizado com sucesso" : "Confirmar Agendamento"}
                visible={dialogVisible}
                onHide={() => {
                    setDialogVisible(false);
                    setIsSuccess(false); // Resetar estado ao fechar
                }}
                footer={
                    !isSuccess && (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                style={{backgroundColor: 'var(--green-400)', border: 'none'}}
                                label={isLoading ? "Confirmando..." : "Confirmar"}
                                icon={isLoading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                                onClick={handleSchedule}
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>
                    )
                }
            >
                {isSuccess ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <img style={{width: '100px', height: '100px'}} src="/layout/images/check-circle.png"/>
                    </div>
                ) : (
                    <div>
                        <p><strong>Serviço:</strong> {selectedService?.name}</p>
                        <p><strong>Profissional:</strong> {selectedProfessional?.name}</p>
                        <p><strong>Data:</strong> {selectedDate ? selectedDate.toLocaleDateString() : 'Nenhuma data selecionada'}</p>
                        <p><strong>Horário:</strong> {selectedTime}</p>
                    </div>
                )}
            </Dialog>
            </div>
        </div>
    );
};

export default LandingPage;
