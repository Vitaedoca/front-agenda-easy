import { BaseService } from "./BaseService";


export class appointmentsService extends BaseService {

    constructor(){
        super("/appointments");
    }

}