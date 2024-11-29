"use client";
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ConfigCodProcedimentoService } from '../../../../service/ConfigCodProcedimentoService';
import { Dropdown } from 'primereact/dropdown';
import { useRouter } from 'next/navigation';


const ConfiguracaoCodigoProcedimento = () => {

    let objetoConfiguracaoVazio: Projeto.ConfiguracaoCodigoProcedimento = {
        id: 0,
        tipo: "",
        codBanco: "",
        codSISREG: "",
        descricaoProcedimento: ""
    }

    let licencaVazia = {
        id: 0
    }

    const [listaConfiguracaoCodigoProcedimento, setListaConfiguracaoProcedimento] = useState<Projeto.ConfiguracaoCodigoProcedimento[]>([])
    const [objetoConfiguracaoCodigoProcedimento, setObjetoConfiguracaoProcedimento] = useState<Projeto.ConfiguracaoCodigoProcedimento>(objetoConfiguracaoVazio)
    const [selecionadoListaConfiguracaoCodigoProcedimento, setSelecionadoListaConfiguracaoProcedimento] = useState<Projeto.ConfiguracaoCodigoProcedimento[]>([])
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [licenca, setLicenca] = useState<Projeto.Licenca>(licencaVazia);
    const [submitted, setSubmitted] = useState(false);
    const [dialogoCadastro, setDialogoCadastro] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const configCodProcedimentoService = useMemo(() => new ConfigCodProcedimentoService(), []);
    const opcoesDropDown = ["Hospital", "Laboratório", "Radiologia"]
    const [dropdownItems, setDropdownItem] = useState<string>("")
    const router = useRouter();

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
        const storeAcessos = localStorage.getItem('USER_DATA');
        if (!storeAcessos?.includes("CONFIG DE CÓDIGO DE PROCEDIMENTO")) {
            router.push('/pages/sem-acesso');
        }
    }, [router]);

    useEffect(() => {
        configCodProcedimentoService.listarTodos()
            .then((response) => {
                setListaConfiguracaoProcedimento(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, [objetoConfiguracaoCodigoProcedimento]);

    const openNew = () => {
        setObjetoConfiguracaoProcedimento(objetoConfiguracaoVazio);
        setSubmitted(false);
        setDialogoCadastro(true);
    };

    const saveConfigProcedimento = () => {
        setSubmitted(true);
        objetoConfiguracaoCodigoProcedimento.tipo = dropdownItems
        if (!objetoConfiguracaoCodigoProcedimento.id) {
            configCodProcedimentoService.inserir(objetoConfiguracaoCodigoProcedimento)
                .then((response) => {
                    setDialogoCadastro(false);
                    setObjetoConfiguracaoProcedimento(objetoConfiguracaoVazio);
                    setListaConfiguracaoProcedimento([]);
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
            console.log(objetoConfiguracaoCodigoProcedimento)
            configCodProcedimentoService.alterar(objetoConfiguracaoCodigoProcedimento)
                .then((response) => {
                    setDialogoCadastro(false);
                    setObjetoConfiguracaoProcedimento(objetoConfiguracaoVazio);
                    setListaConfiguracaoProcedimento([]);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Alterado com sucesso!'
                    });
                }).catch((error) => {
                    console.log(error);
                    console.log(error.data.message);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao alterar!' + error.data.message
                    })
                })
        }
    };

    const editUsuario = (objeto: Projeto.ConfiguracaoCodigoProcedimento) => {
        setObjetoConfiguracaoProcedimento({ ...objeto });
        setDialogoCadastro(true);
    };

    const confirmDeleteUsuario = (objeto: Projeto.ConfiguracaoCodigoProcedimento) => {
        setObjetoConfiguracaoProcedimento(objeto);
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
            <h5 className="m-0">Config Cadastradas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const idBodyTemplate = (rowData: Projeto.ConfiguracaoCodigoProcedimento) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };
    const tipoBodyTemplate = (rowData: Projeto.ConfiguracaoCodigoProcedimento) => {
        return (
            <>
                <span className="p-column-title">Tipo</span>
                {rowData.tipo}
            </>
        );
    };
    const codBancoBodyTemplate = (rowData: Projeto.ConfiguracaoCodigoProcedimento) => {
        return (
            <>
                <span className="p-column-title">Código banco de dados</span>
                {rowData.codBanco}
            </>
        );
    };
    const codSISREGBodyTemplate = (rowData: Projeto.ConfiguracaoCodigoProcedimento) => {
        return (
            <>
                <span className="p-column-title">Código do SISREG</span>
                {rowData.codSISREG}
            </>
        );
    };
    const descricaoProcedimentoBodyTemplate = (rowData: Projeto.ConfiguracaoCodigoProcedimento) => {
        return (
            <>
                <span className="p-column-title">Descrição do Procedimento</span>
                {rowData.descricaoProcedimento}
            </>
        );
    };
    const actionBodyTemplate = (rowData: Projeto.ConfiguracaoCodigoProcedimento) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUsuario(rowData)} />
            </>
        );
    };
    const dialogoCadastroFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveConfigProcedimento} />
        </>
    );
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _variavel = { ...objetoConfiguracaoCodigoProcedimento };
        _variavel[`${name}`] = val;

        setObjetoConfiguracaoProcedimento(_variavel);
    };


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={listaConfiguracaoCodigoProcedimento}
                        selection={selecionadoListaConfiguracaoCodigoProcedimento}
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
                        <Column field="email" header="Código SISREG" sortable body={codSISREGBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
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
                                value={objetoConfiguracaoCodigoProcedimento.codBanco}
                                onChange={(e) => onInputChange(e, 'codBanco')}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !objetoConfiguracaoCodigoProcedimento.codBanco
                                })}
                            />
                            {submitted && !objetoConfiguracaoCodigoProcedimento.codBanco && <small className="p-invalid"> Código Banco de Dados é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="codSISREG">Código Procedimento do SISREG</label>
                            <InputText
                                id="codSISREG"
                                value={objetoConfiguracaoCodigoProcedimento.codSISREG}
                                onChange={(e) => onInputChange(e, 'codSISREG')}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !objetoConfiguracaoCodigoProcedimento.codSISREG
                                })}
                            />
                            {submitted && !objetoConfiguracaoCodigoProcedimento.codSISREG && <small className="p-invalid"> Código Banco de Dados é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descricaoProcedimento">Descrição do Procedimento</label>
                            <InputText
                                id="descricaoProcedimento"
                                value={objetoConfiguracaoCodigoProcedimento.descricaoProcedimento}
                                onChange={(e) => onInputChange(e, 'descricaoProcedimento')}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !objetoConfiguracaoCodigoProcedimento.descricaoProcedimento
                                })}
                            />
                            {submitted && !objetoConfiguracaoCodigoProcedimento.descricaoProcedimento && <small className="p-invalid"> Descrição do Procedimento é obrigatório.</small>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ConfiguracaoCodigoProcedimento;
