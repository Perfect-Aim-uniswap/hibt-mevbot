import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the Nlbr pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'nlbr',
  pure: false
})
export class Nlbr implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(input: string) {
    let span = document.createElement('span');
    if (!input) return input;
    let lines = input.split('\n');

    for (let i = 0; i < lines.length; i++) {
      span.innerText = lines[i];
      span.textContent = lines[i];  //for Firefox
      lines[i] = span.innerHTML;
    }
    return lines.join('<br />');

  }
}
