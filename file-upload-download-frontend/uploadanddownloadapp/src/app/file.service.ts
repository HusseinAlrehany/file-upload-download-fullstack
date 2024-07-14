import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  //define a function to upload the files
upload(formData: FormData): Observable<HttpEvent<string[]>>{
  return this.http.post<string[]>(`${this.apiUrl}/file/upload`, formData,{
    reportProgress: true,
    observe: 'events'
  });
}
  //define a function to download the file
  download(fileName: string): Observable<HttpEvent<Blob>>{
    return this.http.get(`${this.apiUrl}/file/download/${fileName}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    });
  }
}
