import axios from "axios";
import { BaseService } from "./BaseService";


export class ProcedimentoService extends BaseService {

    constructor() {
        super("/procedimento");
    }

}