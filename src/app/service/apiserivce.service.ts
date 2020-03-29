import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Covid } from "../covid/covid";

@Injectable({
  providedIn: "root"
})
export class ApiserivceService {
  constructor(private http: HttpClient) {}

  getCoronaInformation(): Observable<Covid[]> {
    return this.http.get<any>("https://corona.lmao.ninja/countries");
  }
}
