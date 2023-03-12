import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextToImageService {

  imageUrl!: string;
  constructor() { }

  
  public setImage(v : string) {
    this.imageUrl = v;
  }
  
  
  public getImage() : string {
    return this.imageUrl;
  }
  
  


}
