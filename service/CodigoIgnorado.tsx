import axios from "axios";
import { BaseService } from "./BaseService";


export class CodigosIgnorado extends BaseService {

    constructor() {
        super("/codigo-ignorado");
    }

}