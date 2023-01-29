import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private MODELS_API = 'https://api.openai.com/v1/models';
  private COMPLETION_API = 'https://api.openai.com/v1/completions';
  private IMAGE_GENERATION_API = 'https://api.openai.com/v1/images/generations';
  private IMAGE_VARIATION_API = 'https://api.openai.com/v1/images/variations';

  //private API_KEY = environment.openapiKey;

  constructor(private http: HttpClient) { }

  createFileHeader(apiToken: string) {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiToken
    });

  }

  listModels(apiToken: string) {
    return this.http.get(this.MODELS_API, { headers: this.createFileHeader(apiToken) });
  }

  retrieveModel(model: string, apiToken: string) {
    let params = new HttpParams().set('model', model);
    return this.http.get(this.MODELS_API, { headers: this.createFileHeader(apiToken), params: params });
  }

  createCompletion(prompt: string, model: string, maxTokens: number, temperature: number, apiToken: string) {
    const data = { prompt: prompt, model: model, max_tokens: maxTokens, temperature: temperature }
    return this.http.post(this.COMPLETION_API, data, { headers: this.createFileHeader(apiToken) });
  }

  createImage(prompt: string, noOfImage: number, imageSize: string, responseFormat: string, apiToken: string) {
    const data = { prompt: prompt, n: noOfImage, size: imageSize, response_format: responseFormat }
    return this.http.post(this.IMAGE_GENERATION_API, data, { headers: this.createFileHeader(apiToken) });
  }

  createImageVariation(formData: FormData, apiToken: string) {
    let fileHeders = new HttpHeaders({
      'Authorization': 'Bearer ' + apiToken
    });
    return this.http.post(this.IMAGE_VARIATION_API, formData, { headers: fileHeders });
  }
}

