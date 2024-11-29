"use client";
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CodigosIgnorado } from '../../../../service/CodigoIgnorado';
import { Dropdown } from 'primereact/dropdown';


const CodigoIgnorado = () => {

    let ObsIgnoradoVazio: Projeto.CodigoIgnorado = {
        id: 0,
        tipo: "",
        codBanco: "",
        obsIgnorado: "",
        descricaoProcedimento: ""
    }

    let licencaVazia = {
        id: 0
    }

    const [listaCodigoIgnorado, setListaCodigoIgnorado] = useState<Projeto.CodigoIgnorado[]>([])
    const [objetoCodigoIgnorado, setObjetoCodigoIgnorado] = useState<Projeto.CodigoIgnorado>(ObsIgnoradoVazio)
    const [selecionadolistaCodigoIgnorado, setSelecionadoListaConfiguracaoProcedimento] = useState<Projeto.CodigoIgnorado[]>([])
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [licenca, setLicenca] = useState<Projeto.Licenca>(licencaVazia);
    const [submitted, setSubmitted] = useState(false);
    const [dialogoCadastro, setDialogoCadastro] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const codigoIgnoradoService = useMemo(() => new CodigosIgnorado(), []);
    const opcoesDropDown = ["Hospital", "Laboratório", "Radiologia"]
    const [dropdownItems, setDropdownItem] = useState<string>("")

    const [deleteUsuariosDialog, setDeleteUsuariosDialog] = useState(false);
    const [selectedUsuarios, setSelectedUsuarios] = useState<Projeto.Usuario[]>([]);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState(false);

    // Carrega o ID da licença do localStorage
    useEffect(() => {
        const storedLicencaId = localStorage.getItem('LICENCA');
        if (storedLicencaId) {
            const parsedId = parseInt(storedLicencaId, 10);
            if (!isNaN(parsedId)) {
                setLicenca({ id: parsedId });
            }
        }
    }, []);

    useEffect(() => {
        codigoIgnoradoService.listarTodos()
            .then((response) => {
                setListaCodigoIgnorado(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        codigoIgnoradoService.listarTodos()
            .then((response) => {
                setListaCodigoIgnorado(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []); // Dependências vazias

    const openNew = () => {
        setObjetoCodigoIgnorado(objetoCodigoIgnorado);
        setSubmitted(false);
        setDialogoCadastro(true);
    };

    const saveCodigoIgnorado = () => {
        setSubmitted(true);
        objetoCodigoIgnorado.tipo = dropdownItems;

        // Verifique se os valores são válidos antes de continuar
        if (!objetoCodigoIgnorado.codBanco || !objetoCodigoIgnorado.obsIgnorado || !objetoCodigoIgnorado.descricaoProcedimento) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Preencha todos os campos obrigatórios!'
            });
            return;
        }
        if (!objetoCodigoIgnorado.id) {
            codigoIgnoradoService.inserir(objetoCodigoIgnorado)
                .then((response) => {
                    setDialogoCadastro(false);
                    setObjetoCodigoIgnorado(ObsIgnoradoVazio);
                    setListaCodigoIgnorado([]);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Cadastrado com sucesso!'
                    });
                }).catch((error) => {
                    console.log(error.data.message);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao salvar!' + error.data.message
                    })
                });
        } else {
            console.log("Objeto Alterar: ", objetoCodigoIgnorado)
            codigoIgnoradoService.alterar(objetoCodigoIgnorado)
                .then((response) => {
                    setDialogoCadastro(false);
                    setObjetoCodigoIgnorado(ObsIgnoradoVazio);
                    setListaCodigoIgnorado([]); // Atualize a lista com novos dados, se necessário
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Alterado com sucesso!',
                    });
                })
                .catch((error) => {
                    console.log('Erro capturado no catch:', error);

                    const message = error?.response?.data?.message || 'Erro inesperado!';
                    const status = error?.response?.status;

                    console.log(`Status: ${status}, Mensagem: ${message}`);

                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: `Erro ao alterar: ${message}`,
                    });
                });

        }
    };

    const editarLancamento = (objeto: Projeto.CodigoIgnorado) => {
        setObjetoCodigoIgnorado({ ...objeto });
        setDialogoCadastro(true);
    };

    const confirmDeleteUsuario = (objeto: Projeto.CodigoIgnorado) => {
        setObjetoCodigoIgnorado(objeto);
        setDeleteUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDialogoCadastro(false);
    };

    const confirmDeleteSelected = () => {
        setDeleteUsuariosDialog(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsuarios || !(selectedUsuarios as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Cadastro Ignorados Cadastradas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const idBodyTemplate = (rowData: Projeto.CodigoIgnorado) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };
    const tipoBodyTemplate = (rowData: Projeto.CodigoIgnorado) => {
        return (
            <>
                <span className="p-column-title">Tipo</span>
                {rowData.tipo}
            </>
        );
    };
    const codBancoBodyTemplate = (rowData: Projeto.CodigoIgnorado) => {
        return (
            <>
                <span className="p-column-title">Código banco de dados</span>
                {rowData.codBanco}
            </>
        );
    };
    const codSISREGBodyTemplate = (rowData: Projeto.CodigoIgnorado) => {
        return (
            <>
                <span className="p-column-title">Obs Ignorado</span>
                {rowData.obsIgnorado}
            </>
        );
    };
    const descricaoProcedimentoBodyTemplate = (rowData: Projeto.CodigoIgnorado) => {
        return (
            <>
                <span className="p-column-title">Descrição do Procedimento</span>
                {rowData.descricaoProcedimento}
            </>
        );
    };
    const actionBodyTemplate = (rowData: Projeto.CodigoIgnorado) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editarLancamento(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUsuario(rowData)} />
            </>
        );
    };
    const dialogoCadastroFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveCodigoIgnorado} />
        </>
    );
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _variavel = { ...objetoCodigoIgnorado };
        _variavel[name] = val;
        setObjetoCodigoIgnorado(_variavel);
    };


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={listaCodigoIgnorado}
                        selection={selecionadolistaCodigoIgnorado}
                        onSelectionChange={(e) => setSelecionadoListaConfiguracaoProcedimento(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} configurações"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhuma configuração cadastrada."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
                        <Column field="nome" header="Tipo" sortable body={tipoBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
                        <Column field="login" header="Código BD" sortable body={codBancoBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
                        <Column field="email" header="Obs Ignorado" sortable body={codSISREGBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
                        <Column field="email" header="Descrição Procedimento" sortable body={descricaoProcedimentoBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={dialogoCadastro} style={{ width: '450px' }} header="Cadastro de novo código" modal className="p-fluid" footer={dialogoCadastroFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nome">TIPO</label>
                            <Dropdown id="state" value={dropdownItems} onChange={(e) => setDropdownItem(e.value)} options={opcoesDropDown} placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field">
                            <label htmlFor="codBanco">Código Banco de Dados</label>
                            <InputText
                                id="codBanco"
                                value={objetoCodigoIgnorado.codBanco}
                                onChange={(e) => onInputChange(e, 'codBanco')}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !objetoCodigoIgnorado.codBanco
                                })}
                            />
                            {submitted && !objetoCodigoIgnorado.codBanco && <small className="p-invalid"> Código Banco de Dados é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="obsIgnorado">Observação código Ignorado</label>
                            <InputText
                                id="obsIgnorado"
                                value={objetoCodigoIgnorado.obsIgnorado}
                                onChange={(e) => onInputChange(e, 'obsIgnorado')}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !objetoCodigoIgnorado.obsIgnorado
                                })}
                            />
                            {submitted && !objetoCodigoIgnorado.obsIgnorado && <small className="p-invalid">Observacção Ignorado é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descricaoProcedimento">Descrição do Procedimento</label>
                            <InputText
                                id="descricaoProcedimento"
                                value={objetoCodigoIgnorado.descricaoProcedimento}
                                onChange={(e) => onInputChange(e, 'descricaoProcedimento')}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !objetoCodigoIgnorado.descricaoProcedimento
                                })}
                            />
                            {submitted && !objetoCodigoIgnorado.descricaoProcedimento && <small className="p-invalid"> Descrição do Procedimento é obrigatório.</small>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default CodigoIgnorado;
