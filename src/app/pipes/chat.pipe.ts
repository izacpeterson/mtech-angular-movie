import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatPipe'
})
export class ChatPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {

    let script = new RegExp(/<\/?script>/gi)
    let whiteSp = new RegExp(/^\s+|\s+$/g)

    return value.replace(script, '[script]').replace(whiteSp, '');
  }

}
