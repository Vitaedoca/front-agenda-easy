'use client';
/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface Props {
    name: string;
    isSelected: boolean;
    onSelect: () => void;
}

const ProfessionalComponent = ({ name, isSelected, onSelect }: Props) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: isSelected ? 'rgba(83,83,236, 0.2)' : 'transparent', // Fundo alterado quando selecionado
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #C4C4C4', // Borda preta de 1px
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
            }}
            onClick={onSelect} // Alterna a seleção ao clicar
        >
            <img
                src="/layout/images/image-principal.png"
                style={{
                    width: '80px',
                    height: '80px', // Garantir que altura seja igual à largura
                    borderRadius: '100%',
                    marginBottom: '10px',
                    objectFit: 'cover', // Garantir que a imagem se ajuste corretamente ao espaço circular
                }}
                alt="Serviço"
            />
            <div style={{ maxWidth: '150px', textAlign: 'center' }}>
                <span style={{ fontSize: '15px', color:  'black' }}>{name}</span>
            </div>
        </div>
    );
};

export default ProfessionalComponent;
