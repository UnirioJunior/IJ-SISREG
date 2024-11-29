import axios from "axios";
import { BaseService } from "./BaseService";


export class LicencaService extends BaseService {

    constructor() {
        super("/licenca");
    }

}