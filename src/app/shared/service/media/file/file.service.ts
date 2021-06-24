import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  fileToUpload: File;
  uploadedFile: File;

  filePreviewUrl: string;
  fileUrlFromDB: string;

  fileIsUploading = false;
  fileUploaded = false;

  fileSubject = new Subject<string>();

  constructor() { }

  // Methode servant à emettre les categories du service vers un component
  emitFile(){
    this.fileSubject.next(this.filePreviewUrl);
  }

  // Fonction permettant de télécharger un fichier dans la BDD
  uploadFile(file:File, ref:firebase.storage.Reference){

    this.fileIsUploading = true;

    return new Promise(
      (resole, reject) =>{
        const almostUniqueFileName = Date.now().toString();

        const fileRef = ref.child(almostUniqueFileName+file.name);

        const uploadTask = fileRef.put(file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
              }
          },
          (error) => {
            console.log("Erreur de chargement : ",error);
            reject();
          },
          () => {
            console.log("Chargement terminé");

            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              console.log("FileLink :", downloadURL);
              resole(downloadURL);
            });
          }
        );
      }
    );
  }

  deleteFileByRef(ref, cb, error){

    // Delete the file
    return ref.delete().then(cb).catch(error);
  }

}
