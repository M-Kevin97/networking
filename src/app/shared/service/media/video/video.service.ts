import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  videoToUpload: File;
  uploadedVideo: File;

  videoPreviewUrl: string;
  videoUrlFromDB: string;

  videoIsUploading = false;
  videoUploaded = false;

  videoSubject = new Subject<string>();

  constructor() { }

  // Methode servant à emettre les categories du service vers un component
  emitImage(){
    this.videoSubject.next(this.videoPreviewUrl);
  }

  // Fonction permettant de télécharger une image dans la BDD
  uploadFile(file:File, ref:firebase.storage.Reference){

    this.videoIsUploading = true;

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
              console.log("VideoLink :", downloadURL);
              resole(downloadURL);
            });
          }
        );
      }
    );
  }

  deleteVideoByRef(ref, cb, error){

    // Delete the file
    return ref.delete().then(cb).catch(error);
  }

  getImagePreview(file: File) {

    if (file) {
      const reader = new FileReader();

      this.videoToUpload = file;
      reader.readAsDataURL(file);
      
      reader.onload = () => {
      this.videoPreviewUrl = reader.result.toString();

      this.emitImage();
      }
    }
  }

  // Fonction permettant de supprimer une image de la DB
  deleteImageFromDB(){

  }
}
