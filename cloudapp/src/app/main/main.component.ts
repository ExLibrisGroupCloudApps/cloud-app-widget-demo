import { Observable  } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  loading = false;
  selectedEntity: Entity;
  apiResult: any; 
  userGroups: any[] = [];

  entities$: Observable<Entity[]> = this.eventsService.entities$
  .pipe(tap(() => this.clear()))

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private alert: AlertService 
  ) { }

  ngOnInit() {
    this.restService.call('/conf/code-tables/UserGroups').subscribe(res=>{
      res.row.forEach(row => {
        this.restService.call('/users?q=user_group~'+row.code).subscribe(users=>{
          let group: string = row.description + " ("+row.code+")";
          let amount: number = users.total_record_count;
          this.userGroups.push(  { "group": group , "amount": amount } );
        });
      });
    });
  }


  ngOnDestroy(): void {
  }

  clear() {
    this.apiResult = null;
    this.selectedEntity = null;
  }

  private tryParseJson(value: any) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
    return undefined;
  }
}