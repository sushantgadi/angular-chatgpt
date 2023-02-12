import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from './services/chat.service';
import { environment } from '../environments/environment';
import { TextExtractorService } from './services/text-extractor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  apiToken: string = environment.openapiKey;
  maxTokens: number = 1000;
  temperature: number = 0.9;
  defaultModel: string = 'text-davinci-003';
  imageSizes: Array<string> = ['256x256', '512x512', '1024x1024'];
  defaultImageSize: string = '256x256';
  defaultNoOfImage: number = 10;
  responseFormats: Array<string> = ['url', 'b64_json'];
  defaultResponseFormat: string = 'url';

  response: string = '';
  imageResponse: any;
  imageVariationResponse: any;
  models: any;
  selectedFileName: string = 'No File Selected';
  selectedFile: any;
  selectFileType: string = "";
  extractedFileText: string = "";

  loading: boolean = false;

  documentStoryFormGroup!: FormGroup;
  topicSearchFormGroup!: FormGroup;
  imageSearchFormGroup!: FormGroup;
  imageVariationFormGroup!: FormGroup;


  constructor(private chatService: ChatService, private textExtractorService: TextExtractorService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.createTopicSearchForm();
    this.createImageSearchForm();
    this.createImageVariationForm();
    this.createDocumentStoryForm();
    this.listModels();
  }

  createDocumentStoryForm() {
    this.documentStoryFormGroup = this.formBuilder.group({
      'model': [this.defaultModel, Validators.required],
      'maxTokens': [this.maxTokens, [Validators.required, Validators.max(4096), Validators.min(1)]],
      'temperature': [this.temperature, [Validators.required, Validators.max(0.9), Validators.min(0)]],
      'appendText': ['create a detailed story for below document ', Validators.required]
    });
  }

  createTopicSearchForm() {
    this.topicSearchFormGroup = this.formBuilder.group({
      'model': [this.defaultModel, Validators.required],
      'maxTokens': [this.maxTokens, [Validators.required, Validators.max(4096), Validators.min(1)]],
      'temperature': [this.temperature, [Validators.required, Validators.max(0.9), Validators.min(0)]],
      'prompt': [null, Validators.required]
    });
  }

  createImageSearchForm() {
    this.imageSearchFormGroup = this.formBuilder.group({
      'imageSize': [this.defaultImageSize, Validators.required],
      'noOfImage': [this.defaultNoOfImage, [Validators.required, Validators.max(10), Validators.min(1)]],
      'responseFormat': [this.defaultResponseFormat, Validators.required],
      'prompt': [null, Validators.required]
    });
  }

  createImageVariationForm() {
    this.imageVariationFormGroup = this.formBuilder.group({
      'imageSize': [this.defaultImageSize, Validators.required],
      'noOfImage': [this.defaultNoOfImage, [Validators.required, Validators.max(10), Validators.min(1)]],
      'responseFormat': [this.defaultResponseFormat, Validators.required]
    });
  }


  listModels() {
    this.chatService.listModels(this.apiToken).subscribe((response: any) => {
      this.models = response.data;
    });
  }

  retrieveModel(model: string) {
    this.chatService.retrieveModel(model, this.apiToken).subscribe((response: any) => {
      this.models = response;
    });
  }

  createCompletion() {
    this.loading = true;
    this.response = 'Loading....';
    this.chatService.createCompletion(this.topicSearchFormGroup.get('prompt')?.value,
      this.topicSearchFormGroup.get('model')?.value,
      this.topicSearchFormGroup.get('maxTokens')?.value,
      this.topicSearchFormGroup.get('temperature')?.value, this.apiToken).subscribe({
        next: (response: any) => {
          this.response = response?.['choices'][0]['text'];
          this.loading = false;
        },
        error: (response: any) => {
          console.error('There was an error!', response);
          this.response = response?.error?.error?.message;
          this.loading = false;
        }
      });
  }

  getDocumentStory() {
    this.loading = true;
    let text = this.documentStoryFormGroup.get('appendText')?.value + this.extractedFileText;
    this.response = 'Loading....';
    this.chatService.createCompletion(text,
      this.documentStoryFormGroup.get('model')?.value,
      this.documentStoryFormGroup.get('maxTokens')?.value,
      this.documentStoryFormGroup.get('temperature')?.value, this.apiToken).subscribe({
        next: (response: any) => {
          this.response = response?.['choices'][0]['text'];
          this.loading = false;
        },
        error: (response: any) => {
          console.error('There was an error!', response);
          this.response = response?.error?.error?.message;
          this.loading = false;
        }
      });
  }

  createImage() {
    this.loading = true;
    this.chatService.createImage(this.imageSearchFormGroup.get('prompt')?.value,
      this.imageSearchFormGroup.get('noOfImage')?.value,
      this.imageSearchFormGroup.get('imageSize')?.value,
      this.imageSearchFormGroup.get('responseFormat')?.value, this.apiToken).subscribe({
        next: (response: any) => {
          this.imageResponse = response?.data;
          this.loading = false;
        },
        error: (response: any) => {
          console.error('There was an error!', response);
          this.response = response?.error?.error?.message;
          this.loading = false;
        }
      });
  }

  imageUpload(fileInputEvent: any) {
    console.log(fileInputEvent.target.files);
    this.selectedFile = fileInputEvent.target.files[0];
    this.selectedFileName = this.selectedFile.name;
  }

  imageUploadStory(fileInputEvent: any) {
    console.log(fileInputEvent.target.files);
    this.selectedFile = fileInputEvent.target.files[0];
    this.selectedFileName = this.selectedFile.name;
    if (this.selectedFileName === 'eob_1.png') {
      this.selectFileType = 'EOB(Explainantion Of Benifits)';
      this.extractedFileText = this.textExtractorService.getText(this.selectedFileName);
    } else if (this.selectedFileName == 'pres_1.png') {
      this.selectFileType = 'Prescription';
      this.extractedFileText = this.textExtractorService.getText(this.selectedFileName);
    } else {
     // alert("Invalid file selected.")
    }
  }

  createImageVariation() {
    this.loading = true;


    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('n', this.imageSearchFormGroup.get('noOfImage')?.value);
    formData.append('size', this.imageSearchFormGroup.get('imageSize')?.value);


    this.chatService.createImageVariation(formData, this.apiToken).subscribe({
      next: (response: any) => {
        this.imageVariationResponse = response?.data;
        this.loading = false;
      },
      error: (response: any) => {
        console.error('There was an error!', response);
        this.response = response?.error?.error?.message;
        this.loading = false;
      }
    });
  }

}