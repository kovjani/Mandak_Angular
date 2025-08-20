import {Component} from '@angular/core';
import {SearchbarService} from "../../../services/searchbar.service";
import {AudioPlayerService} from "../../../services/audio-player.service";
import {FooterComponent} from "../../footer/footer.component";
import {HeaderImageComponent} from "../../header-image/header-image.component";
import {NavbarComponent} from "../../navbar/navbar.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
    imports: [
        FooterComponent,
        HeaderImageComponent,
        NavbarComponent
    ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

    constructor(private searchbarService: SearchbarService, private audioService: AudioPlayerService) {}
    cookies_accepted = localStorage.getItem("cookies_accepted") === 'true';

}
