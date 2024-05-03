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

  checkAppMode(){
    var darkMode = false;
    const isAppInDarkMode = localStorage.getItem('darkModeActivated');
    isAppInDarkMode == 'true'?(darkMode = true):(darkMode = false);
    document.body.classList.toggle('dark', darkMode);
    return darkMode;
  }

  toggleDarkMode(darkMode: boolean){
    darkMode = !darkMode;

    document.body.classList.toggle('dark', darkMode);

    if(darkMode){
      localStorage.setItem('darkModeActivated', 'true');
    } else {
      localStorage.setItem('darkModeActivated', 'false');
    }
  }
}
