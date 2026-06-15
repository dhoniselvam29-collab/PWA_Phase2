import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-success-screen',
  templateUrl: './success-screen.page.html',
  styleUrls: ['./success-screen.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],

})
export class SuccessScreenPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
