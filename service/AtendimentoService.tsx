import axios from "axios";
import { BaseService } from "./BaseService";


export class AtendimentoService extends BaseService {

    constructor() {
        super("/atendimento");
    }

}