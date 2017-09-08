import { Injectable, Inject } from "@angular/core";
// dto
import { JsonObj } from '../types/jsonObj';

@Injectable()
export class EncodeDecodeJsonObjService {

    public encodeJson(jsonData: any): any {
        var data = "";
        var find = "=";
        var re = new RegExp(find, "g");
        data = btoa(JSON.stringify(jsonData));
        data = data.replace(re, "-");
        data = data.split("").reverse().join("");
        data = btoa(data);
        data = data.replace(re, "-");
        return data;
    }

    public decodeJson(jsonData: any): any {
        var jsonObj: JsonObj;
        var data = "";
        var find = "-";
        var re = new RegExp(find, "g");
        data = jsonData.replace(re, "=");
        data = atob(data);
        data = data.split("").reverse().join("");
        data = data.replace(re, "=");
        data = atob(data);
        jsonObj = JSON.parse(data);
        return jsonObj;
    }
}