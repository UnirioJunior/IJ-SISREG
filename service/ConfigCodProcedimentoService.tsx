import axios from "axios";
import { BaseService } from "./BaseService";


export class ConfigCodProcedimentoService extends BaseService {

    constructor() {
        super("/config-cod-procedimento");
    }

}