import axios from "axios";
import { BaseService } from "./BaseService";


export class RiscoService extends BaseService {

    constructor() {
        super("/risco");
    }

}