import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileService } from './file.service';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  fileNames: string[] = [];
  fileStatus = { status: '', requestType: '', percent: 0};

  
 constructor(private fileService: FileService){}

 //define a funtion to upload files
  onUploadFiles(files: File[]): void{
   const formData = new FormData();
   for(const file of files){formData.append('files', file, file.name);}

   this.fileService.upload(formData).subscribe(
    event =>{
      console.log(event);
      this.reportProgress(event);
    },
    (error: HttpErrorResponse)=>{
      console.log(error);
    }
   );
 }

//define a funtion to download files
onDownloadFiles(fileName: string): void{
  this.fileService.download(fileName).subscribe(
   event =>{
     console.log(event);
     this.reportProgress(event);
   },
   (error: HttpErrorResponse)=>{
     console.log(error);
   }
  );
}

  private reportProgress(httpEvent: HttpEvent<string[] | Blob> ): void {
     
    switch(httpEvent.type){
      case HttpEventType.UploadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Uploading... ');
        break;
        case HttpEventType.DownloadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Downloading... ');
        break;
        case HttpEventType.ResponseHeader:
          console.log('Header Returned',httpEvent);
        break;
        case HttpEventType.Response:
        if(httpEvent.body instanceof Array){
            //upload logic
             for(const fileName of httpEvent.body){
              //using unshift instead of push
              //to put the most recent in the top
              this.fileNames.unshift(fileName);
             }
        }
        else{
              //download logic
              saveAs(new File([httpEvent.body!], httpEvent.headers.get('File-Name')!,
              {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}
            ));
        }
        this.fileStatus.status = 'done';
        break;
        default:
          console.log(httpEvent);
        break;
    }

  }
  //for report progress
 private  updateStatus(loaded: number, total: number , requestType: string) {
     this.fileStatus.status = 'progress';
     this.fileStatus.requestType = requestType;
     this.fileStatus.percent = Math.round(100 * loaded/total);

  }


}



