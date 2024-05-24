import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { PhotoUser } from '../interface/photo-user';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Injectable } from '@angular/core';4

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: PhotoUser[] = [];
  private PHOTO_STORAGE: string = 'photos';

  constructor(
    private platform: Platform
  ) { }
  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, 
      source: CameraSource.Camera,
      quality: 100 
    });

  const savedImageFile = await this.savePicture(capturedPhoto);

    this.photos.unshift(savedImageFile);    
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });    
  }

  private async savePicture(photo: Photo) { 
      const base64Data = await this.readAsBase64(photo);

      const fileName = new Date().getTime() + '.jpeg';
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data
      });

      if (this.platform.is('hybrid')) {
        return {
          filepath: savedFile.uri,
          webviewPath: Capacitor.convertFileSrc(savedFile.uri)
        };
      }
      else {
        return {
          filepath: fileName,
          webviewPath: photo.webPath
        };
      }
  }  

  private async readAsBase64(photo: Photo| any) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path
      });

      return file.data;
    }
    else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadSaved() {
     const photoList = await Preferences.get({ key: this.PHOTO_STORAGE });
     this.photos = JSON.parse(photoList.value?photoList.value:'') || [];

     if (!this.platform.is('hybrid')) {
       for (let photo of this.photos) {
         const readFile = await Filesystem.readFile({
             path: photo.filepath,
             directory: Directory.Data
         });

         photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
       }
     }    
  }

  public async deletePicture(photo: PhotoUser, position: number) {
    this.photos.splice(position, 1);

    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });

    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  } 
}