declare namespace Projeto {
    type Usuario = {
        id: number;
        licenca: Licenca
        nome: string;
        login: string;
        senha: string
        email: string;
        situacao: string
        acessos: string[];
    };

    type Recurso = {
        id?: number;
        nome: string;
        chave: string;
    }

    type Perfil = {
        id?: number;
        descricao: string;
    }

    type PerfilUsuario = {
        id?: number;
        perfil: Perfil;
        usuario: Usuario;
    }

    type PermissaoPerfilRecurso = {
        id?: number;
        perfil: Perfil;
        recurso: Recurso;
    }

    type Paciente = {
        DT_BAIXA: string;
        CD_HOSPITAL: string;
        NR_FIA: string;
        DT_ANO_FIA: string;
        CD_PACIENTE: string;
        CNS: string;
        NM_PACIENTE: string;
        CPF_PACIENTE: string;
        LEI_CD_HOSPITAL: string;
        HOS4_CD_HOSPITAL: string;
        NR_ARQUIVO: string;
        SC_UNIDADE: string;
        SC_CLINICA: string;
        SC_PLANO_SAUDE: string;
        CD_PLANO_SAUDE: string;
        DIAS_INTERNADO: string;
        HORAS_INTERNADO: string;
        CD_TP_PLANO: string;
        DT_NASCIMENTO: string;
        IDADE: string;
    };


    type Licenca = {
        id: number;
    }

    type ConsultarStatus = {
        HASHKEY: string
        USERNAME: string
        PASSWORD: string
        CNS: string
        DT_INTERNADO: string
    }

    type ProcedimentoSisreg = {
        cod_procedimento: string,
        desc_procedimento: string,
        dt_execucao_procedimento: string,
        qtd_procedimento: string,
        status_regulacao: string
    }

    type ConfiguracaoCodigoProcedimento = {
        id: number,
        tipo: string,
        codBanco: string,
        codSISREG: string,
        descricaoProcedimento: string
    }

    type CodigoIgnorado = {
        id: number,
        tipo: string,
        codBanco: string,
        obsIgnorado: string,
        descricaoProcedimento: string
    }
}