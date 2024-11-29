import axios from "axios";
import { BaseService } from "./BaseService";


export class PreditorItemService extends BaseService {

    constructor() {
        super("/preditor_item");
    }

}