import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextExtractorService {

  constructor() { }


  getText(docName : string) {

    let response: string = '';

    if(docName === 'eob_1.png'){
      response  = `
      `
    }
    return response;
  }
}
