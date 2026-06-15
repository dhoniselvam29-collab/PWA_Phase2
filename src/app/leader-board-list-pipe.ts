import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leaderBoardList'
})
export class LeaderBoardListPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
