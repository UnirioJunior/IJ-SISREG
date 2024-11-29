import React from 'react';
import Link from 'next/link';

const NotFoundPage = () => {
    const sidebarWidth = 250; // Largura fixa da barra lateral, ajuste conforme necessário.

    return (
        <div
            className="surface-ground flex justify-content-center min-h-screen overflow-hidden"
            style={{
                paddingLeft: NotFoundPage.showSidebar !== false ? sidebarWidth : 0, // Compensar a barra lateral
            }}
        >
            <div
                className="flex flex-column align-items-center"
                style={{
                    marginTop: '5px', // Espaço do topo
                }}
            >
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)',
                    }}
                >
                    <div
                        className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center"
                        style={{ borderRadius: '53px' }}
                    >
                        <h1 className="text-4xl font-bold mb-4">Você não tem acesso</h1>
                        <p className="text-lg mb-6">Parece que você tentou acessar uma página sem permissão.</p>
                        <Link href="/" className="p-button p-component p-button-primary p-button-lg">
                            Voltar para a Página Principal
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Desabilita a barra lateral nesta página
NotFoundPage.showSidebar = false;

export default NotFoundPage;
