import {Pipe,PipeTransform} from '@angular/core';

@Pipe({name:'nameTruncate'})
export class nameTruncatePipe implements PipeTransform{
  transform(value: string, ...args: any[]) {
      if(!value){
        return ;
      }
      if(typeof value !== 'string'){
        return
      }
      const strLength = value.length;
      if(strLength>20){
        return value.slice(0,10) + ''+value.slice(strLength-4,strLength)
      }
      else {
        return value;
      }
  }
}
