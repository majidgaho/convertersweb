import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import axios from 'axios';
import { executeRequest } from 'src/app/helpers';
import { ImageData, TextToImageService } from '../text-to-image.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-text-to-image',
  templateUrl: './text-to-image.component.html',
  styleUrls: ['./text-to-image.component.scss']
})
export class TextToImageComponent implements OnInit {
  inputText = '';
  imageUrl: string | undefined;
  loading!: boolean;
  imageSizeOptions!: any;
  imageSize!: string;
  @ViewChild('imagePreview') imagePreviewElementDiv!: ElementRef;
  isLoading!: boolean;
  isUpscaling!: boolean;
  images: ImageData[] = [];

  constructor(private textToImageService: TextToImageService){

  }
  
  ngOnInit(){
    this.imageSizeOptions = ['512x512']
    
  }

  async generateImage() {
    this.isLoading = true;
    // this.loading = true;
    // const response = await axios.post('https://api.openai.com/v1/images/generations', {
    //   model: 'image-alpha-001',
    //   prompt: `Create an image of "${this.inputText}"`,
    //   num_images: 1,
    //   size: this.imageSize,
    //   response_format: 'url'
    // }, {
    //   headers: {
    //     Authorization: 'Bearer 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'
    //   }
    // });
    // this.loading = false;
    // this.imageUrl = response.data.data[0].url;
    for(var i=0; i<4; i++){
      await executeRequest(`${this.inputText}`, this.imagePreviewElementDiv);
    }
    
    this.isLoading = false;
    console.table(this.textToImageService.getImages());
    
    this.images = this.textToImageService.getImages();
    console.log(this.imageUrl);
    
  }

  async downloadImage(){
    // const base64 = this.textToImageService.getImageData().artifactory.getBinary_asB64();
    // const fileName = `image-${this.textToImageService.getImageData().artifactory.getSeed()}.png`;
    // this.downloadBase64Image(base64, fileName)
  }

  downloadBase64Image(base64Data: string, fileName: string) {
    const byteCharacters = atob(base64Data.replace('data:image/png;base64,', ''));
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    saveAs(blob, fileName);
  }

  async upscale() {
    this.isUpscaling = true;
    // await upscale();
    this.isUpscaling = false;
    // this.imageUrl = this.textToImageService.getImageData().imageSrc;
    console.log(this.imageUrl);
    
  }
  
}
