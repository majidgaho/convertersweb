import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import axios from 'axios';
import { executeRequest } from 'src/app/helpers';
import { TextToImageService } from '../text-to-image.service';

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
  showImageArea!: boolean;

  constructor(private textToImageService: TextToImageService){

  }
  
  ngOnInit(){
    this.imageSizeOptions = ['512x512']
    
  }

  async generateImage() {
    this.showImageArea = false;
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
    await executeRequest(`${this.inputText}`, this.imagePreviewElementDiv);
    this.showImageArea = true;
    this.imageUrl = this.textToImageService.imageUrl;
    console.log(this.imageUrl);
    
  }

  async downloadImage(){

  }
  
}
