import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OthersService {

  constructor() { }

  changeFileInputStateOnFileSelect(value: string){
    if(value){
      return true;
    } else {
      return false;
    }
  }

  changeFileInputLabelOnFileSelect(value: string, textSelected: string, textNotSelected: string){
    if(value){
      return textSelected;
    } else {
      return textNotSelected;
    }
  }
}
