/* eslint-disable @next/next/no-img-element */
'use client';
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
import { Projeto } from '../../../../types/types';
import { UsuarioService } from '../../../../service/UsuarioService';
import { Password } from 'primereact/password';
import { InputSwitch } from 'primereact/inputswitch';
import { useRouter } from 'next/navigation';

const Usuario = () => {
    let usuarioVazio: Projeto.Usuario = {
        id: 0,
        licenca: { id: 0 },
        nome: '',
        login: '',
        senha: '',
        email: '',
        situacao: 'P',
        acessos: []
    };

    let licencaVazia = {
        id: 0
    }

    const [usuarios, setUsuarios] = useState<Projeto.Usuario[] | null>(null);
    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState(false);
    const [deleteUsuariosDialog, setDeleteUsuariosDialog] = useState(false);
    const [usuario, setUsuario] = useState<Projeto.Usuario>(usuarioVazio);
    const [selectedUsuarios, setSelectedUsuarios] = useState<Projeto.Usuario[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const usuarioService = useMemo(() => new UsuarioService(), []);
    const [licenca, setLicenca] = useState<Projeto.Licenca>(licencaVazia);
    const [liberacaoCadastroUsuarios, setLiberacaoCadastroUsuarios] = useState(false);
    const [liberacaoCadastroDb, setLiberacaoCadastroDb] = useState(false);
    const [liberacaoCodigoProcedimento, setLiberacaoCodigoProcedimento] = useState(false);
    const [liberacaoCodigosIgnorados, setLiberacaoCodigosIgnorados] = useState(false);
    const router = useRouter();

    // Carrega o ID da licença do localStorage
    useEffect(() => {
        const storedLicencaId = localStorage.getItem('LICENCA');
        if (storedLicencaId) {
            const parsedId = parseInt(storedLicencaId, 10);
            if (!isNaN(parsedId)) {
                setLicenca({ id: parsedId });
            }
        }
    }, []); // Esse efeito só será executado uma vez quando o componente montar

    useEffect(() => {
        const storeAcessos = localStorage.getItem('USER_DATA');
        if (!storeAcessos?.includes("CADASTRO DE USUARIOS")) {
            router.push('/pages/sem-acesso');
        }
    }, [router]);

    useEffect(() => {
        if (licenca.id !== 0 && !usuarios) {
            usuarioService.listarTodos()
                .then((response) => {
                    const usuariosFiltrados = response.data.filter((usuario: Projeto.Usuario) => {
                        return usuario.licenca.id === licenca.id;
                    });
                    setUsuarios(usuariosFiltrados);

                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [licenca.id, usuarios]); // Esse efeito será executado sempre que licenca.id 

    const openNew = () => {
        setUsuario(usuarioVazio);
        setSubmitted(false);
        setUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUsuarioDialog(false);
    };

    const hideDeleteUsuarioDialog = () => {
        setDeleteUsuarioDialog(false);
    };

    const hideDeleteUsuariosDialog = () => {
        setDeleteUsuariosDialog(false);
    };

    const saveUsuario = () => {
        setSubmitted(true);
        if (!usuario.id) {
            usuario.situacao = 'A'
            usuario.licenca = licenca
            usuarioService.inserir(usuario)
                .then((response) => {
                    setUsuarioDialog(false);
                    setUsuario(usuarioVazio);
                    setUsuarios(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Usuário cadastrado com sucesso!'
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
            usuarioService.alterar(usuario)
                .then((response) => {
                    setUsuarioDialog(false);
                    setUsuario(usuarioVazio);
                    setUsuarios(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Usuário alterado com sucesso!'
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
        setUsuario(usuarioVazio)
    }

    const editUsuario = (usuario: Projeto.Usuario) => {
        if (usuario.id === undefined) {
            console.error("ID do usuário está indefinido. Verifique os dados do usuário.");
            return;
        }

        usuarioService.buscarPordId(usuario.id).then((response) => {
            const usuarioEditado = response.data;

            setLiberacaoCadastroUsuarios(usuarioEditado.acessos.includes("CADASTRO DE USUARIOS"));
            setLiberacaoCadastroDb(usuarioEditado.acessos.includes("CONFIG BANCO DE DADOS"));
            setLiberacaoCodigoProcedimento(usuarioEditado.acessos.includes("CONFIG DE CÓDIGO DE PROCEDIMENTO"));
            setLiberacaoCodigosIgnorados(usuarioEditado.acessos.includes("CONFIG DE CÓDIGOS IGNORADOS"));

            setUsuario({ ...usuarioEditado });
            setUsuarioDialog(true);
        });
    };


    const confirmDeleteUsuario = (usuario: Projeto.Usuario) => {
        setUsuario(usuario);
        setDeleteUsuarioDialog(true);
    };

    const deleteUsuario = () => {
        if (usuario.id) {
            usuarioService.excluir(usuario.id).then((response) => {
                setUsuario(usuarioVazio);
                setDeleteUsuarioDialog(false);
                setUsuarios(null);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Usuário Deletado com Sucesso!',
                    life: 3000
                });
            }).catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao deletar o usuário!',
                    life: 3000
                });
            });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteUsuariosDialog(true);
    };

    const deleteSelectedUsuarios = () => {

        Promise.all(selectedUsuarios.map(async (_usuario) => {
            if (_usuario.id) {
                await usuarioService.excluir(_usuario.id);
            }
        })).then((response) => {
            setUsuarios(null);
            setSelectedUsuarios([]);
            setDeleteUsuariosDialog(false);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Usuários Deletados com Sucesso!',
                life: 3000
            });
        }).catch((error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Erro ao deletar usuários!',
                life: 3000
            })
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _usuario = { ...usuario };
        _usuario[`${name}`] = val;

        setUsuario(_usuario);
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
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const nomeBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    };

    const loginBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Login</span>
                {rowData.login}
            </>
        );
    };

    const emailBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };


    const actionBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUsuario(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Usuários</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const usuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveUsuario} />
        </>
    );
    const deleteUsuarioDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteUsuarioDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteUsuario} />
        </>
    );
    const deleteUsuariosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteUsuariosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedUsuarios} />
        </>
    );

    const handleAcessoChange = (checked: boolean, acesso: string) => {
        if (checked) {
            // Adiciona o acesso se não existir
            setUsuario((prevUsuario) => ({
                ...prevUsuario,
                acessos: prevUsuario.acessos.includes(acesso)
                    ? prevUsuario.acessos
                    : [...prevUsuario.acessos, acesso],
            }));
        } else {
            // Remove o acesso
            setUsuario((prevUsuario) => ({
                ...prevUsuario,
                acessos: prevUsuario.acessos.filter((a) => a !== acesso),
            }));
        }
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={usuarios}
                        selection={selectedUsuarios}
                        onSelectionChange={(e) => setSelectedUsuarios(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} usuários"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum usuário encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
                        <Column field="nome" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
                        <Column field="login" header="Login" sortable body={loginBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
                        <Column field="email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={usuarioDialog} style={{ width: '450px' }} header="Detalhes de Usuário" modal className="p-fluid" footer={usuarioDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText
                                id="nome"
                                value={usuario.nome}
                                onChange={(e) => onInputChange(e, 'nome')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.nome
                                })}
                            />
                            {submitted && !usuario.nome && <small className="p-invalid">Nome é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="login">Login</label>
                            <InputText
                                id="login"
                                value={usuario.login}
                                onChange={(e) => onInputChange(e, 'login')}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !usuario.login
                                })}
                            />
                            {submitted && !usuario.login && <small className="p-invalid">Login é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="senha">Senha</label>
                            <Password
                                inputId="senha"
                                value={usuario.senha}
                                toggleMask
                                onChange={(e) => onInputChange(e, 'senha')}
                                required
                                className="" inputClassName="w-full p-3 md:w-30rem"
                            />
                            <small id="senha" className="p-error" >
                                Se estiver editando, cuidado!!!, a senha será alterada de acordo com o que estiver nesse campo.
                            </small>
                            {submitted && !usuario.senha && <small className="p-invalid">Senha é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                value={usuario.email}
                                onChange={(e) => onInputChange(e, 'email')}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !usuario.email
                                })}
                            />
                            {submitted && !usuario.email && <small className="p-invalid">Email é obrigatório.</small>}
                        </div>
                        <div className="field" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <label>Acesso ao cadastro de usuários</label>
                            <InputSwitch
                                checked={liberacaoCadastroUsuarios}
                                onChange={(e) => {
                                    const isChecked = e.value || false;
                                    setLiberacaoCadastroUsuarios(isChecked);
                                    handleAcessoChange(isChecked, "CADASTRO DE USUARIOS");
                                }}
                            />
                        </div>

                        <div className="field" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <label>Acesso à configuração do banco de dados</label>
                            <InputSwitch
                                checked={liberacaoCadastroDb}
                                onChange={(e) => {
                                    const isChecked = e.value || false;
                                    setLiberacaoCadastroDb(isChecked);
                                    handleAcessoChange(isChecked, "CONFIG BANCO DE DADOS");
                                }}
                            />
                        </div>

                        <div className="field" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <label>Acesso à configuração de código de procedimento</label>
                            <InputSwitch
                                checked={liberacaoCodigoProcedimento}
                                onChange={(e) => {
                                    const isChecked = e.value || false;
                                    setLiberacaoCodigoProcedimento(isChecked);
                                    handleAcessoChange(isChecked, "CONFIG DE CÓDIGO DE PROCEDIMENTO");
                                }}
                            />
                        </div>

                        <div className="field" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <label>Acesso à configuração de códigos ignorados</label>
                            <InputSwitch
                                checked={liberacaoCodigosIgnorados}
                                onChange={(e) => {
                                    const isChecked = e.value || false;
                                    setLiberacaoCodigosIgnorados(isChecked);
                                    handleAcessoChange(isChecked, "CONFIG DE CÓDIGOS IGNORADOS");
                                }}
                            />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuarioDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsuarioDialogFooter} onHide={hideDeleteUsuarioDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && (
                                <span>
                                    Você realmente deseja excluir o usuario <b>{usuario.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuariosDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsuariosDialogFooter} onHide={hideDeleteUsuariosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && <span>Você realmente deseja excluir os usuários selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Usuario;
