import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../shared/services/translation.service';

@Component({
    selector: 'page-profile',
    templateUrl: './new-project-profile.html',
    styleUrls: ['./new-project-profile.scss']  
})
export class NewProjectProfile implements OnInit {

  constructor(private t: TranslationService){}

  ngOnInit(){}

}
