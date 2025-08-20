import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'http://localhost/api';
    constructor(private http: HttpClient) { }

    postData(endpoint: string, data: any): Observable<any> {
        const url = `${this.apiUrl}/${endpoint}`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(url, data, { headers });
    }
}
