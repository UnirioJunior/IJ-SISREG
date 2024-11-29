import axios from "axios";
import { BaseService } from "./BaseService";


export class PreditorService extends BaseService {

    constructor() {
        super("/preditor");
    }

}