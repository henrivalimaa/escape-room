import { Component, OnInit } from '@angular/core';
import { ScoreService } from '../services/score.service';
import { fadeAnimation } from '../animations/animations';
import { Result } from '../services/result';
import { map } from 'rxjs/operators';

@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  animations: [fadeAnimation]
})
export class LeaderboardComponent implements OnInit {

	private results: any;
	private leaderboards: any = [];
	private loadingLeaderboard: boolean = false;

	slideConfig = {'slidesToShow': 1, 'dots': true};

  constructor(private scoreService: ScoreService) { }

  ngOnInit() {
  	this.refreshLeaderboards();
  }

  refreshLeaderboards(): void {
    this.loadingLeaderboard = true;
    setTimeout(() => {
      this.scoreService.getGameResultList('halloween-2018').snapshotChanges().pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      ).subscribe(results => {
          this.results = results;
          this.sortResults('score', 'DESC');
          this.leaderboards.push({ name: 'Halloween 2018', results: this.results });
          this.scoreService.getGameResultList('christmas-2018').snapshotChanges().pipe(
		        map(changes =>
		          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
		        )
		      ).subscribe(results => {
		          this.results = results;
		          this.sortResults('score', 'DESC');
		          this.leaderboards.push({ name: 'Christmas 2018', results: this.results });	
		          this.scoreService.getGameResultList('new-years-2018').snapshotChanges().pipe(
                map(changes =>
                  changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
                )
              ).subscribe(results => {
                  this.results = results;
                  this.sortResults('score', 'DESC');
                  this.leaderboards.push({ name: 'New Years 2018', results: this.results });  
                  this.loadingLeaderboard = false;
              });
		      });
      });
     }, 3000); 
  }

  sortResults<T>(propName: keyof Result, order: "ASC" | "DESC"): void {
    this.results.sort((a, b) => {
        if (a[propName] < b[propName])
            return -1;
        if (a[propName] > b[propName])
            return 1;
        return 0;
    });

    if (order === "DESC") {
        this.results.reverse();
    }
  }

  convertTime(seconds: number): string {
    let m = Math.floor(seconds / 60);
    let s = seconds - m * 60;
    return `${m}min ${s}s`;
  }
}
