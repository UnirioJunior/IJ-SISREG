import axios from "axios";
import { BaseService } from "./BaseService";


export class ClassificacaoService extends BaseService {

    constructor() {
        super("/classificacao");
    }

}