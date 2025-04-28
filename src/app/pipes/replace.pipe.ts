import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace',
  pure: true,
  standalone: true,
})
export class ReplacePipe implements PipeTransform {
  transform(value: string, oldChar: string, replacement: string): string {
    return value.replace(oldChar, replacement);
  }
}
