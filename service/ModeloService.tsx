import axios from "axios";
import { BaseService } from "./BaseService";


export class ModeloService extends BaseService {

    constructor() {
        super("/modelo");
    }

}