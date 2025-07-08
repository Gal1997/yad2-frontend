import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from '../../cmps/app-header/app-header.component';

@Component({
  selector: 'app-publish-page',
  imports: [RouterModule, CommonModule, AppHeaderComponent],
  templateUrl: './publish-page.component.html',
  styleUrl: './publish-page.component.scss'
})
export class PublishPageComponent {

}
