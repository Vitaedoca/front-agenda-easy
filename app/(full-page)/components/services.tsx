// Componente ServiceComponent
'use client';
/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface Props {
    name: string;
    duration: string;
    price: string;
    isSelected: boolean;
    onSelect: () => void;
}

const ServiceComponent = ({ name, duration, price, isSelected, onSelect }: Props) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: isSelected ? 'rgba(83,83,236, 0.2)' : 'transparent',  // Altera o fundo quando selecionado
                padding: '10px',
                borderBottom: '0.5px solid #dcdcdc ',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
            }}
            onClick={onSelect}  // Alterna a seleção ao clicar
        >
            <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                    <img
                        src="/layout/images/image-principal.png"
                        style={{ width: '70px', borderRadius: '5px' }}
                        alt="Serviço"
                    />
                </div>

                <div style={{ maxWidth: '150px' }}>
                    <span style={{ fontSize: '15px', color: 'black' }}>{name}</span>
                    <p style={{ fontSize: '12px' }}>R$ {price} - {duration} min</p>
                </div>
            </div>

            <div>
                <button
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '10px',
                        width: '110px',
                        background: 'var(--green-400)',
                        border: 'none',
                        borderRadius: '5px',
                        color: 'white',
                        cursor: 'pointer',
                    }}
                >
                    <p style={{ fontSize: '12PX'}}>ADICIONAR</p>
                </button>
            </div>
        </div>
    );
};

export default ServiceComponent;
