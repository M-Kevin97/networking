import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ImageService {

  imageToUpload: File;
  uploadedImage: File;

  imagePreviewUrl: string;
  imageUrlFromDB: string;

  imageIsUploading = false;
  imageUploaded = false;

  imageSubject = new Subject<string>();

  constructor() { }

  // Methode servant à emettre les categories du service vers un component
  emitImage(){
    this.imageSubject.next(this.imagePreviewUrl);
  }

  // Fonction permettant de télécharger une image dans la BDD
  uploadFile(file:File, ref:firebase.storage.Reference){

    this.imageIsUploading = true;

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
              console.log("ImageLink :",downloadURL);
              resole(downloadURL);
            });
          }
        );
      }
    );
  }

  // /* 
  // Say you want to only limit the height,
  // and have the width resized accordingly to keep the aspect ratio the same. 
  // Just set whichever side should just fallow to a value of 10000
  // */
  // resizeImageWithHeightOnly(event, height:number) {
  //   if (event.target.files && event.target.files[0]) {

  //     let image = event.target.files[0];

  //     this.ng2ImgMax.resizeImage(image, 10000, height).subscribe(
  //       result => {
  //         this.uploadedImage = new File([result], result.name);
  //         this.getImagePreview(this.uploadedImage);
  //       },
  //       error => {
  //         console.log('😢 Oh no!', error);
  //       }
  //     );
  //   }
  // }

  // /* 
  // Say you want to only limit the width,
  // and have the width resized accordingly to keep the aspect ratio the same. 
  // Just set whichever side should just fallow to a value of 10000
  // */
  // resizeImageWithWidthOnly(event, width:number) {

  //   if (event.target.files && event.target.files[0]) {

  //     let image = event.target.files[0];

  //     this.ng2ImgMax.resizeImage(image, width, 10000).subscribe(
  //       result => {
  //         this.uploadedImage = new File([result], result.name);
  //         this.getImagePreview(this.uploadedImage);
  //       },
  //       error => {
  //         console.log('😢 Oh no!', error);
  //       }
  //     );
  //   }
  // }

  // /*
  // You can compress the image. Just pass-in a maximum value in megabytes. 
  // Exemple : 0.075 => 75Kb
  // */
  // compressImage(image:File, megabytes:number) {

  //   this.ng2ImgMax.compressImage(image, megabytes).subscribe(
  //     result => {
  //       this.uploadedImage = new File([result], result.name);
  //       this.getImagePreview(this.uploadedImage);
  //     },
  //     error => {
  //       console.log('😢 Oh no!', error);
  //     }
  //   );
  // }

  getImagePreview(file: File) {

    if (file) {
      const reader = new FileReader();

      this.imageToUpload = file;
      reader.readAsDataURL(file);
      
      reader.onload = () => {
      this.imagePreviewUrl = reader.result.toString();

      this.emitImage();
      }
    }
  }

  // Fonction permettant de supprimer une image de la DB
  deleteImageFromDB(){

  }

}