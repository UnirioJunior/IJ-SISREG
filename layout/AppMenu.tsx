import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [filteredModel, setFilteredModel] = useState<AppMenuItem[]>([]);

    useEffect(() => {
        const storeAcessos = localStorage.getItem('USER_DATA');
        if (storeAcessos) {
            let acessos: string[] = [];
            try {
                const userData = JSON.parse(storeAcessos); // Parseia o objeto completo
                if (userData && Array.isArray(userData.acessos)) {
                    acessos = userData.acessos; // Pega o campo 'acessos'
                } else {
                    console.error('O campo "acessos" não é válido:', userData.acessos);
                }
            } catch (error) {
                console.error('Erro ao parsear USER_DATA:', error);
            }

            // Define as permissões mapeadas para cada item do menu
            const menuPermissions: Record<string, string> = {
                '/pages/usuario': 'CADASTRO DE USUARIOS',
                '/pages/empty': 'CONFIG BANCO DE DADOS',
                '/pages/configuracaoCodProcedimento': 'CONFIG DE CÓDIGO DE PROCEDIMENTO',
                '/pages/codigosIgnorados': 'CONFIG DE CÓDIGOS IGNORADOS',
            };

            // Função para filtrar os itens do menu com base nas permissões
            const filterMenuItems = (items: AppMenuItem[]): AppMenuItem[] => {
                return items
                    .map((item) => {
                        if (item.items) {
                            const filteredSubItems = filterMenuItems(item.items);
                            return { ...item, items: filteredSubItems };
                        }

                        const permission = menuPermissions[item.to || ''];
                        if (!permission || acessos.includes(permission)) {
                            return item;
                        }

                        return null;
                    })
                    .filter((item) => item !== null) as AppMenuItem[];
            };

            // Filtra o menu principal
            const filteredModel = filterMenuItems(model);
            setFilteredModel(filteredModel);
        }
    }, []);

    const model: AppMenuItem[] = [
        {
            label: 'SISTEMA',
            items: [{ label: 'Home', icon: 'pi pi-home', to: '/' }]
        },
        {
            label: 'CONFIGURAÇÕES',
            items: [
                {
                    label: 'Geral',
                    icon: 'pi pi-cog',
                    items: [
                        { label: 'Configuração DB', icon: 'pi pi-cog', to: '/pages/empty' },
                        { label: 'Configuração de Códigos de Procedimento', icon: 'pi pi-cog', to: '/pages/configuracaoCodProcedimento' },
                        { label: 'Configuração de Códigos Ignorados', icon: 'pi pi-cog', to: '/pages/codigosIgnorados' }
                    ]
                }
            ]
        },
        {
            label: 'Controle de Usuarios',
            items: [
                {
                    label: 'Usuarios',
                    icon: 'pi pi-user',
                    items: [{ label: 'Cadastro', icon: 'pi pi-user-plus', to: '/pages/usuario' }]
                }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {filteredModel.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
