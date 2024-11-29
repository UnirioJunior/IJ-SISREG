import axios from "axios";
import { BaseService } from "./BaseService";


export class PerfilUsuarioService extends BaseService {

    constructor() {
        super("/perfil-usuario");
    }

    buscarPeloIdUsuario(userId: number) {
        return this.buscarPordId(userId); // Método já implementado no BaseService
    }
}