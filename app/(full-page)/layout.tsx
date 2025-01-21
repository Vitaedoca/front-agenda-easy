import { Metadata } from 'next';
import profissionais from '../../layout/profissionais';
import React from 'react';

interface SimpleLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'PrimeReact Sakai',
    description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.'
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    return (
        <React.Fragment>
            {children}
            <profissionais simple />
        </React.Fragment>
    );
}
