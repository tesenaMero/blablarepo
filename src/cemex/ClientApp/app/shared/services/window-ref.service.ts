import { Injectable } from '@angular/core';
function _window() : any {
   // return the global native browser window object
   return window;
}
function _btoa(data) : any {
    // return the global native browser window object
    return window.btoa(data);
 }
@Injectable()
export class WindowRef {
   get nativeWindow() : any {
      return _window();
   }
   btoa(data: any) : any {
    return _btoa(data);
 }
}