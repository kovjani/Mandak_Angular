import {Component, OnInit} from '@angular/core';
import {SearchbarService} from "../../../services/searchbar.service";
import {AudioPlayerService} from "../../../services/audio-player.service";
import {FooterComponent} from "../../footer/footer.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-villa-page',
  standalone: true,
    imports: [
        FooterComponent
    ],
  templateUrl: './villa-page.component.html',
  styleUrl: './villa-page.component.scss'
})
export class VillaPageComponent {

    images = [
        "/assets/images/villa/1.jpg",
        "/assets/images/villa/2.jpg",
        "/assets/images/villa/3.jpg",
        "/assets/images/villa/4.jpg",
        "/assets/images/villa/5.jpg",
        "/assets/images/villa/6.jpg",
        "/assets/images/villa/7.jpg",
        "/assets/images/villa/8.jpg",
        "/assets/images/villa/9.jpg",
        "/assets/images/villa/10.jpg",
        "/assets/images/villa/11.jpg",
        "/assets/images/villa/12.jpg",
        "/assets/images/villa/13.jpg",
        "/assets/images/villa/14.jpg",
        "/assets/images/villa/15.jpg",
        "/assets/images/villa/16.jpg",
        "/assets/images/villa/17.jpg",
        "/assets/images/villa/18.jpg",
    ];


    constructor(private router: Router) {}

    ViewInGallery(index: number){
        this.router.navigate(['/gallery'], {queryParams: {images: JSON.stringify(this.images), index: index}});
    }
}
