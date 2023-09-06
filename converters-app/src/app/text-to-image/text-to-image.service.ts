import { Injectable } from '@angular/core';
import * as Generation from "../../generation/generation_pb";

export interface ImageData {
  uuid: string;
  imageSrc: string;
  artifactory: Generation.Artifact;
}

export interface Images{
  images: Array<ImageData>;
}

@Injectable({
  providedIn: 'root'
})
export class TextToImageService {

  imageData!: ImageData[];
  imageUrl!: string;
  constructor() { }

  
  public setImage(v : string) {
    this.imageUrl = v;
  }
  
  
  public getImage() : string {
    return this.imageUrl;
  }

  public setImages(images: ImageData[]) {
    this.imageData = images;
  }
  
  
  public getImages() : ImageData[] {
    return this.imageData;
  }
  
  


}
