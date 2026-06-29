import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'replace' })
export class MockReplacePipe implements PipeTransform {
  transform(value: string, search: string, replace: string): string {
    return value.replace(new RegExp(search, 'g'), replace);
  }
}
