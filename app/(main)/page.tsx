"use client";
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ConsultarSISREG } from '../../service/ConsultarSISREGService';

const Principal = () => {

    let licencaVazia = {
        id: 0
    }

    let pacienteSelecionadoVazio = {
        DT_BAIXA: "",
        CD_HOSPITAL: "",
        NR_FIA: "",
        DT_ANO_FIA: "",
        CD_PACIENTE: "",
        CNS: "",
        NM_PACIENTE: "",
        CPF_PACIENTE: "",
        LEI_CD_HOSPITAL: "",
        HOS4_CD_HOSPITAL: "",
        NR_ARQUIVO: "",
        SC_UNIDADE: "",
        SC_CLINICA: "",
        SC_PLANO_SAUDE: "",
        CD_PLANO_SAUDE: "",
        DIAS_INTERNADO: "",
        HORAS_INTERNADO: "",
        CD_TP_PLANO: "",
        DT_NASCIMENTO: "",
        IDADE: ""
    }

    let varConsultarStatus = {
        HASHKEY: "010277a2cbdae41aa43e1db3c4054531",
        USERNAME: "03721780140DRABNER",
        PASSWORD: "hospital1793",
        CNS: "",
        DT_INTERNADO: ""
    }

    const [licenca, setLicenca] = useState<Projeto.Licenca>(licencaVazia);
    const [pacientes, setPacientes] = useState<Projeto.Paciente[]>([]);
    const [dialogoPendencias, setdialogoPendencias] = useState(false);
    const [dialogoMostrarProcedimentosSisreg, setDialogoProcedimentosSisreg] = useState(false);
    const [pendenciaGeral, setPendenciaGeral] = useState(1);
    const [pacienteSelecionado, setPacienteSelecionado] = useState<Projeto.Paciente>(pacienteSelecionadoVazio);
    const consultarStatusService = useMemo(() => new ConsultarSISREG(), []);
    const [isLoading, setIsLoading] = useState(false); // Estado para controlar o loading
    const [expiracaoPorPaciente, setExpiracaoPorPaciente] = useState<Record<number, number>>({}); // Mapeia pacientes pelo ID com timestamps de última consulta
    const [dadosSisregBuscados, setDadosSisregBusdos] = useState<Projeto.ProcedimentoSisreg[]>([])



    // Carrega o ID da licença do localStorage
    useEffect(() => {
        const storedLicencaId = localStorage.getItem('LICENCA');
        if (storedLicencaId) {
            const parsedId = parseInt(storedLicencaId, 10);
            if (!isNaN(parsedId)) {
                setLicenca({ id: parsedId });
            }
        }
        console.log('dadosSisregBuscados:', dadosSisregBuscados);
    }, []);

    // ATRIBUI O JSON DE PACIENTE NA VARIAVEL PACIENTE
    useEffect(() => {
        setPacientes(
            [{ "DT_BAIXA": "2024-10-28 22:42:12", "CD_HOSPITAL": "1", "NR_FIA": "53554", "DT_ANO_FIA": "2024", "CD_PACIENTE": "47035", "CNS": "708202651072646", "NM_PACIENTE": "LUZIA RODRIGUES DE FRANCA", "CPF_PACIENTE": "13956701291", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "46987", "SC_UNIDADE": "UTI GERAL", "SC_CLINICA": "INTENSIVISMO", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "20", "HORAS_INTERNADO": "491", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "1955-08-23 00:00:00", "IDADE": "69 Anos" },
            { "DT_BAIXA": "2024-11-14 01:05:58", "CD_HOSPITAL": "1", "NR_FIA": "55962", "DT_ANO_FIA": "2024", "CD_PACIENTE": "47478", "CNS": "708907736516814", "NM_PACIENTE": "CELINA WAUTOMORA", "CPF_PACIENTE": "01296717119", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "47430", "SC_UNIDADE": "UTI GERAL", "SC_CLINICA": "INTENSIVISMO", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "4", "HORAS_INTERNADO": "105", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "1978-06-08 00:00:00", "IDADE": "46 Anos" },
            { "DT_BAIXA": "2024-11-12 20:50:02", "CD_HOSPITAL": "1", "NR_FIA": "55806", "DT_ANO_FIA": "2024", "CD_PACIENTE": "46648", "CNS": "898006377231239", "NM_PACIENTE": "ANTHONY GABRIEL LAZARO SOUZA", "CPF_PACIENTE": "12234164109", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "46600", "SC_UNIDADE": "UTI PEDIATRICA", "SC_CLINICA": "CLINICA MEDICA", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "6", "HORAS_INTERNADO": "133", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "2024-06-16 00:00:00", "IDADE": "5 Meses" },
            { "DT_BAIXA": "2024-10-29 07:38:04", "CD_HOSPITAL": "1", "NR_FIA": "53572", "DT_ANO_FIA": "2024", "CD_PACIENTE": "47039", "CNS": "706802751923425", "NM_PACIENTE": "NICOLAS GUILHERME SANTOS MAIA", "CPF_PACIENTE": "53621899804", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "46991", "SC_UNIDADE": "UTI PEDIATRICA", "SC_CLINICA": "CLINICA MEDICA", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "20", "HORAS_INTERNADO": "482", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "2011-06-16 00:00:00", "IDADE": "13 Anos" },
            { "DT_BAIXA": "2024-11-12 21:18:30", "CD_HOSPITAL": "1", "NR_FIA": "55811", "DT_ANO_FIA": "2024", "CD_PACIENTE": "47448", "CNS": "700902922342995", "NM_PACIENTE": "VALENTINA MAXIMIANO DOS SANTOS", "CPF_PACIENTE": "70414103157", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "47400", "SC_UNIDADE": "UTI PEDIATRICA", "SC_CLINICA": "CLINICA MEDICA", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "6", "HORAS_INTERNADO": "133", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "2024-09-14 00:00:00", "IDADE": "2 Meses" },
            { "DT_BAIXA": "2024-11-04 21:56:00", "CD_HOSPITAL": "1", "NR_FIA": "54630", "DT_ANO_FIA": "2024", "CD_PACIENTE": "13775", "CNS": "700004905941207", "NM_PACIENTE": "ARI ASSIS RIGATTI", "CPF_PACIENTE": "10654194904", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "13743", "SC_UNIDADE": "UTI GERAL", "SC_CLINICA": "INTENSIVISMO", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "12", "HORAS_INTERNADO": "277", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "1948-08-28 00:00:00", "IDADE": "76 Anos" },
            { "DT_BAIXA": "2024-10-09 14:21:05", "CD_HOSPITAL": "1", "NR_FIA": "50966", "DT_ANO_FIA": "2024", "CD_PACIENTE": "46522", "CNS": "705007698667753", "NM_PACIENTE": "ALVIZE SACHET", "CPF_PACIENTE": "17633281987", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "46474", "SC_UNIDADE": "UTI GERAL", "SC_CLINICA": "CLINICA MEDICA", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "40", "HORAS_INTERNADO": "956", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "1938-05-02 00:00:00", "IDADE": "86 Anos" },
            { "DT_BAIXA": "2024-11-13 18:25:17", "CD_HOSPITAL": "1", "NR_FIA": "55947", "DT_ANO_FIA": "2024", "CD_PACIENTE": "47476", "CNS": "700604953102060", "NM_PACIENTE": "NEEMIAS RAVI AIKPE RIKBAKTA", "CPF_PACIENTE": "04790944115", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "47428", "SC_UNIDADE": "UTI PEDIATRICA", "SC_CLINICA": "INTENSIVISMO", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "5", "HORAS_INTERNADO": "112", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "2024-02-10 00:00:00", "IDADE": "9 Meses" },
            { "DT_BAIXA": "2024-10-17 18:25:21", "CD_HOSPITAL": "1", "NR_FIA": "52131", "DT_ANO_FIA": "2024", "CD_PACIENTE": "46755", "CNS": "898006380293061", "NM_PACIENTE": "RN DE MARIA FERNANDA REZENDE DA SILVA", "CPF_PACIENTE": "", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "46707", "SC_UNIDADE": "UTI NEO", "SC_CLINICA": "CLINICA PEDIATRICA", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "30", "HORAS_INTERNADO": "714", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "2024-10-17 00:00:00", "IDADE": "1 Meses" },
            { "DT_BAIXA": "2024-10-28 14:55:53", "CD_HOSPITAL": "1", "NR_FIA": "53493", "DT_ANO_FIA": "2024", "CD_PACIENTE": "47026", "CNS": "708509312844771", "NM_PACIENTE": "PABLO DA SILVA PEREIRA", "CPF_PACIENTE": "06158433101", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "46978", "SC_UNIDADE": "UTI GERAL", "SC_CLINICA": "CLINICA MEDICA", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "21", "HORAS_INTERNADO": "499", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "1999-08-15 00:00:00", "IDADE": "25 Anos" },
            { "DT_BAIXA": "2024-11-16 20:55:28", "CD_HOSPITAL": "1", "NR_FIA": "56226", "DT_ANO_FIA": "2024", "CD_PACIENTE": "12188", "CNS": "700406985649840", "NM_PACIENTE": "ELENA IZAURA DA FONSECA", "CPF_PACIENTE": "82111847100", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "12161", "SC_UNIDADE": "UTI GERAL", "SC_CLINICA": "INTENSIVISMO", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "2", "HORAS_INTERNADO": "37", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "1938-04-21 00:00:00", "IDADE": "86 Anos" },
            { "DT_BAIXA": "2024-11-01 16:52:00", "CD_HOSPITAL": "1", "NR_FIA": "54313", "DT_ANO_FIA": "2024", "CD_PACIENTE": "47175", "CNS": "898006380832892", "NM_PACIENTE": "RN DE MYRELLE GEOVANNA ROSA FERNANDES", "CPF_PACIENTE": "06631582148", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "47127", "SC_UNIDADE": "UTI NEO", "SC_CLINICA": "INTENSIVISMO", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "17", "HORAS_INTERNADO": "401", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "2024-11-01 00:00:00", "IDADE": "16 Dias" },
            { "DT_BAIXA": "2024-10-08 20:19:07", "CD_HOSPITAL": "1", "NR_FIA": "50836", "DT_ANO_FIA": "2024", "CD_PACIENTE": "46498", "CNS": "898006337073098", "NM_PACIENTE": "DARWIN TSUWAI RA TSEREDI", "CPF_PACIENTE": "01270982168", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "46450", "SC_UNIDADE": "UTI PEDIATRICA", "SC_CLINICA": "INTENSIVISMO", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "41", "HORAS_INTERNADO": "974", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "2023-10-05 00:00:00", "IDADE": "1 Anos" },
            { "DT_BAIXA": "2024-04-10 00:04:10", "CD_HOSPITAL": "1", "NR_FIA": "18522", "DT_ANO_FIA": "2024", "CD_PACIENTE": "35728", "CNS": "898006304887584", "NM_PACIENTE": "MARCIEL BELTON RURIWE AIRI", "CPF_PACIENTE": "11723669180", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "35681", "SC_UNIDADE": "UTI PEDIATRICA", "SC_CLINICA": "CLINICA PEDIATRICA", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "222", "HORAS_INTERNADO": "5338", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "2022-06-12 00:00:00", "IDADE": "2 Anos" },
            { "DT_BAIXA": "2024-11-13 03:21:02", "CD_HOSPITAL": "1", "NR_FIA": "55815", "DT_ANO_FIA": "2024", "CD_PACIENTE": "47449", "CNS": "898005995059485", "NM_PACIENTE": "NATHIEL NASCIMENTO DE OLIVEIRA", "CPF_PACIENTE": "08993315213", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "47401", "SC_UNIDADE": "UTI PEDIATRICA", "SC_CLINICA": "INTENSIVISMO", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "5", "HORAS_INTERNADO": "127", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "2019-12-27 00:00:00", "IDADE": "4 Anos" },
            { "DT_BAIXA": "2024-11-09 15:35:51", "CD_HOSPITAL": "1", "NR_FIA": "55428", "DT_ANO_FIA": "2024", "CD_PACIENTE": "43433", "CNS": "700301986002537", "NM_PACIENTE": "MARIA VALDEREZ DA SILVA", "CPF_PACIENTE": "70013993453", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "43386", "SC_UNIDADE": "UTI GERAL", "SC_CLINICA": "CLINICA MEDICA", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "9", "HORAS_INTERNADO": "210", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "1963-01-25 00:00:00", "IDADE": "61 Anos" },
            { "DT_BAIXA": "2024-11-17 10:07:53", "CD_HOSPITAL": "1", "NR_FIA": "56241", "DT_ANO_FIA": "2024", "CD_PACIENTE": "47541", "CNS": "898006383965079", "NM_PACIENTE": "RN DE SILVANA KNAK DA SILVA", "CPF_PACIENTE": "", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "47493", "SC_UNIDADE": "UTI NEO", "SC_CLINICA": "CLINICA MEDICA", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "1", "HORAS_INTERNADO": "24", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "2024-11-12 00:00:00", "IDADE": "5 Dias" },
            { "DT_BAIXA": "2024-11-14 14:08:18", "CD_HOSPITAL": "1", "NR_FIA": "56061", "DT_ANO_FIA": "2024", "CD_PACIENTE": "47498", "CNS": "702801643308967", "NM_PACIENTE": "RICARDO PEREIRA DA SILVA", "CPF_PACIENTE": "05555834144", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "47450", "SC_UNIDADE": "UTI GERAL", "SC_CLINICA": "INTENSIVISMO", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "4", "HORAS_INTERNADO": "92", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "1992-04-03 00:00:00", "IDADE": "32 Anos" },
            { "DT_BAIXA": "2024-11-16 05:35:51", "CD_HOSPITAL": "1", "NR_FIA": "56180", "DT_ANO_FIA": "2024", "CD_PACIENTE": "47525", "CNS": "700505126705652", "NM_PACIENTE": "ALESSANDRA RODRIGUES DA SILVA MAGALHAES", "CPF_PACIENTE": "86432400104", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "47477", "SC_UNIDADE": "UTI GERAL", "SC_CLINICA": "INTENSIVISMO", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "2", "HORAS_INTERNADO": "52", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "1979-11-16 00:00:00", "IDADE": "45 Anos" },
            { "DT_BAIXA": "2024-11-09 17:39:38", "CD_HOSPITAL": "1", "NR_FIA": "55432", "DT_ANO_FIA": "2024", "CD_PACIENTE": "32260", "CNS": "702400041292127", "NM_PACIENTE": "JAIRO VALDIVIESO", "CPF_PACIENTE": "27688186900", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "32213", "SC_UNIDADE": "UTI GERAL", "SC_CLINICA": "INTENSIVISMO", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "9", "HORAS_INTERNADO": "208", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "1953-11-10 00:00:00", "IDADE": "71 Anos" },
            { "DT_BAIXA": "2024-11-01 14:29:37", "CD_HOSPITAL": "1", "NR_FIA": "54274", "DT_ANO_FIA": "2024", "CD_PACIENTE": "47167", "CNS": "709807069698993", "NM_PACIENTE": "MAXIMINO ASSUNCAO DE OLIVEIRA", "CPF_PACIENTE": "", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "47119", "SC_UNIDADE": "UTI GERAL", "SC_CLINICA": "INTENSIVISMO", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "17", "HORAS_INTERNADO": "404", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "1941-08-25 00:00:00", "IDADE": "83 Anos" },
            { "DT_BAIXA": "2024-11-08 14:01:19", "CD_HOSPITAL": "1", "NR_FIA": "55326", "DT_ANO_FIA": "2024", "CD_PACIENTE": "20928", "CNS": "700007318707900", "NM_PACIENTE": "NEILY ALCANTARA NUNES DE OLIVEIRA", "CPF_PACIENTE": "79458009120", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "20892", "SC_UNIDADE": "UTI GERAL", "SC_CLINICA": "CLINICA MEDICA", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "10", "HORAS_INTERNADO": "236", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "1975-06-09 00:00:00", "IDADE": "49 Anos" },
            { "DT_BAIXA": "2024-11-16 00:37:32", "CD_HOSPITAL": "1", "NR_FIA": "56178", "DT_ANO_FIA": "2024", "CD_PACIENTE": "47524", "CNS": "703405910523800", "NM_PACIENTE": "JORGE ARIEL PINHEIRO DA COSTA", "CPF_PACIENTE": "01652939180", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "47476", "SC_UNIDADE": "UTI GERAL", "SC_CLINICA": "INTENSIVISMO", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "2", "HORAS_INTERNADO": "57", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "1994-05-18 00:00:00", "IDADE": "30 Anos" },
            { "DT_BAIXA": "2024-11-12 06:09:29", "CD_HOSPITAL": "1", "NR_FIA": "55676", "DT_ANO_FIA": "2024", "CD_PACIENTE": "47423", "CNS": "700102947830710", "NM_PACIENTE": "ENZO GABRIEL SOUZA CAMILO", "CPF_PACIENTE": "09451615148", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "47375", "SC_UNIDADE": "UTI PEDIATRICA", "SC_CLINICA": "INTENSIVISMO", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "6", "HORAS_INTERNADO": "148", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "2013-09-15 00:00:00", "IDADE": "11 Anos" },
            { "DT_BAIXA": "2024-10-21 19:17:45", "CD_HOSPITAL": "1", "NR_FIA": "52578", "DT_ANO_FIA": "2024", "CD_PACIENTE": "46854", "CNS": "701809227659779", "NM_PACIENTE": "MARIA AMELIA DE MELO", "CPF_PACIENTE": "51454092149", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "46806", "SC_UNIDADE": "UTI GERAL", "SC_CLINICA": "CLINICA MEDICA", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "28", "HORAS_INTERNADO": "663", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "1952-08-06 00:00:00", "IDADE": "72 Anos" },
            { "DT_BAIXA": "2024-11-08 10:48:18", "CD_HOSPITAL": "1", "NR_FIA": "55295", "DT_ANO_FIA": "2024", "CD_PACIENTE": "47349", "CNS": "707803661584914", "NM_PACIENTE": "OZIAS MONTEIRO DA SILVA", "CPF_PACIENTE": "76095770815", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "47301", "SC_UNIDADE": "UTI GERAL", "SC_CLINICA": "CLINICA CIRURGICA", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "10", "HORAS_INTERNADO": "239", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "1953-10-27 00:00:00", "IDADE": "71 Anos" },
            { "DT_BAIXA": "2024-11-14 01:27:19", "CD_HOSPITAL": "1", "NR_FIA": "55964", "DT_ANO_FIA": "2024", "CD_PACIENTE": "47479", "CNS": "898006383965583", "NM_PACIENTE": "RN MARIA RONIELE GERALDA DA SILVA", "CPF_PACIENTE": "06628606406", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "47431", "SC_UNIDADE": "UTI NEO", "SC_CLINICA": "INTENSIVISMO", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "4", "HORAS_INTERNADO": "105", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "2024-11-13 00:00:00", "IDADE": "4 Dias" },
            { "DT_BAIXA": "2024-10-29 15:40:05", "CD_HOSPITAL": "1", "NR_FIA": "53690", "DT_ANO_FIA": "2024", "CD_PACIENTE": "47068", "CNS": "704600171925124", "NM_PACIENTE": "RN DE JANETE PEREIRA DOS SANTOS", "CPF_PACIENTE": "03124069161", "LEI_CD_HOSPITAL": "1", "HOS4_CD_HOSPITAL": "1", "NR_ARQUIVO": "47020", "SC_UNIDADE": "UTI NEO", "SC_CLINICA": "CLINICA PEDIATRICA", "SC_PLANO_SAUDE": "SUS", "CD_PLANO_SAUDE": "2", "DIAS_INTERNADO": "17", "HORAS_INTERNADO": "408", "CD_TP_PLANO": "7", "DT_NASCIMENTO": "2024-10-25 00:00:00", "IDADE": "23 Dias" }
            ]
        )
    }, []);

    // Função para agrupar pacientes por unidade
    const agrupaPacientesPorUnidade = () => {
        return pacientes.reduce((acc, paciente) => {
            const unidade = paciente.SC_UNIDADE;
            if (!acc[unidade]) {
                acc[unidade] = [];
            }
            acc[unidade].push(paciente);
            return acc;
        }, {} as { [key: string]: Projeto.Paciente[] });
    };

    // Função para atribuir os valores dentro do objeto para enviar o consultar
    const montarObjetoParaConsultarStatusSisreg = () => {
        if (!pacienteSelecionado || !pacienteSelecionado.CNS || !pacienteSelecionado.DIAS_INTERNADO) {
            console.error("Dados do paciente selecionado estão incompletos!");
            return;
        }

        // Atualiza o estado do objeto de consulta SISREG
        const objetoConsulta = {
            HASHKEY: "010277a2cbdae41aa43e1db3c4054531",
            USERNAME: "03721780140DRABNER",
            PASSWORD: "hospital1793",
            CNS: pacienteSelecionado.CNS,
            DT_INTERNADO: pacienteSelecionado.DT_BAIXA, // Certifique-se de que está formatado corretamente
        };

        // Registra o timestamp da consulta para o paciente atual
        setExpiracaoPorPaciente((prev) => ({
            ...prev,
            [pacienteSelecionado.NR_FIA]: Date.now(),
        }));

        chamarConsultarService(objetoConsulta);

    };

    // Função para validar se o botão do consultar Sisreg foi precionado
    const isExpired = useCallback(() => {
        if (!pacienteSelecionado || !expiracaoPorPaciente[pacienteSelecionado.NR_FIA]) {
            return false;
        }
        return Date.now() - expiracaoPorPaciente[pacienteSelecionado.NR_FIA] > 60 * 30 * 1000; // 30 minutos
    }, [pacienteSelecionado, expiracaoPorPaciente]);

    // Função para chamar a API
    const chamarConsultarService = async (objetoConsulta: any) => {
        setIsLoading(true); // Ativa o loading
        try {
            const response = await consultarStatusService.consultar(objetoConsulta);
            setDadosSisregBusdos(response.data);
            console.log("Sucesso:", response.data);
            setDialogoProcedimentosSisreg(true);
        } catch (error) {
            console.error("Erro ao consultar status SISREG:", error);
        } finally {
            setIsLoading(false); // Desativa o loading
        }
    };

    // Função para abrir o diálogo de pendências
    const abrirdialogoPendencias = (paciente) => {
        setPacienteSelecionado(paciente);  // Armazena o paciente clicado
        setdialogoPendencias(true);         // Define o diálogo como visível
    };

    // Função para gerar cards dinamicamente agrupados por unidade
    const geraCardsPorUnidade = () => {
        const pacientesPorUnidade = agrupaPacientesPorUnidade();
        return Object.keys(pacientesPorUnidade).map((unidade, index) => (
            <div key={index} className="col-12">
                <h3>{unidade}</h3>
                <div className="grid p-fluid">
                    {pacientesPorUnidade[unidade].map((paciente, pacienteIndex) => (
                        <div key={pacienteIndex} className="col-12 md:col-4">
                            <div
                                className="card p-fluid flex-column align-items-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => abrirdialogoPendencias(paciente)} // Abre o diálogo ao clicar
                            >
                                <div className="flex align-items-center mb-3" style={{ width: '100%', textAlign: 'center' }}>
                                    <Avatar className="p-overlay-badge mr-3" icon="pi pi-user" size="xlarge">
                                        <Badge value={paciente["DIAS INTERNADO"]} />
                                    </Avatar>
                                    <h5 className="flex-grow-1">{paciente.NM_PACIENTE}</h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ));
    };

    // Apenas fecha o dialogo de pendencias
    const fachardialogoPendencias = () => {
        setdialogoPendencias(false);
    };

    // Apenas fecha o dialogo de pendencias
    const fachardialogoBuscados = () => {
        setDialogoProcedimentosSisreg(false);
    };

    // Botões de interação dentro do dialogo de pendencias
    const opcoesDoFooterPendencias = (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
            }}
        >
            {/* Botão Consultar SISREG à esquerda */}
            <div>
                <Button
                    loading={isLoading}
                    label="Consultar SISREG"
                    icon={isExpired() ? "pi pi-exclamation-triangle" : "pi pi-database"}
                    text
                    onClick={montarObjetoParaConsultarStatusSisreg}
                    style={{
                        color: isExpired() ? "red" : "#6366F1",
                    }}
                />
            </div>

            {/* Outros botões alinhados à direita */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
                    label="Hospital"
                    icon={"pi pi-building"}
                    text
                    onClick={() => console.log("teste")}
                />
                <Button
                    label="Laboratório"
                    icon={"pi pi-pencil"}
                    text
                    onClick={() => console.log("teste")}
                />
                <Button
                    label="Radiologia"
                    icon="pi pi-bolt"
                    text
                    onClick={() => console.log("teste")}
                />
            </div>
        </div>
    );

    // Retorno que vai ser renderisado na tela.
    return (
        <div className="grid p-fluid">
            {geraCardsPorUnidade()}
            <Dialog
                visible={dialogoPendencias}
                style={{ width: "1000px" }}
                header={<span>Informações do Paciente: {pacienteSelecionado.NM_PACIENTE}</span>}
                modal
                footer={opcoesDoFooterPendencias}
                onHide={fachardialogoPendencias}
            >
                <div className="p-fluid grid">
                    {Object.entries(pacienteSelecionado).map(([key, value], index) => (
                        <div
                            className="field col-4 md:col-3"
                            style={{ marginBottom: "1rem" }}
                        >
                            <i> {key}:  {value || "N/A"}</i>

                        </div>
                    ))}
                </div>
            </Dialog>
            <Dialog
                visible={dialogoMostrarProcedimentosSisreg}
                style={{ width: "1000px" }}
                header={<span>Dados buscados no SISREG do paciente: {pacienteSelecionado.NM_PACIENTE}</span>}
                modal
                footer={opcoesDoFooterPendencias}
                onHide={fachardialogoBuscados}
            >
                <div className="p-fluid grid">
                    {dadosSisregBuscados.length > 0 ? (
                        <table className="p-datatable">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Descrição</th>
                                    <th>Data Execução</th>
                                    <th>Quantidade</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dadosSisregBuscados.map((procedimento, index) => (
                                    <tr key={index}>
                                        <td>{procedimento.cod_procedimento}</td>
                                        <td>{procedimento.desc_procedimento}</td>
                                        <td>{procedimento.dt_execucao_procedimento}</td>
                                        <td>{procedimento.qtd_procedimento}</td>
                                        <td>{procedimento.status_regulacao}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Não há dados disponíveis no momento.</p>
                    )}
                </div>
            </Dialog>
        </div>
    );
};
export default Principal;