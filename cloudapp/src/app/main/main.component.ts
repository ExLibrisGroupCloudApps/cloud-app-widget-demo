import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  userGroups: any[] = [];

  constructor(
    private restService: CloudAppRestService,
  ) { }

  ngOnInit() {
    this.restService.call('/conf/code-tables/UserGroups').subscribe(res=>{
      res.row.forEach(row => {
        this.restService.call('/users?q=user_group~'+row.code+'&limit=1').subscribe(users=>{
          let group: string = row.description;
          let code: string = row.code;
          let amount: number = users.total_record_count;
          this.userGroups.push(  { "group": group, "code": code, "amount": amount } );
        });
      });
    });
  }

  ngOnDestroy(): void {
  }

}