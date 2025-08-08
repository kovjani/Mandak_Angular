import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
export class HomePageComponent implements OnInit {
    @Output() update_images = new EventEmitter<string[]>();
    @Output() update_image_index = new EventEmitter<number>();
    @Output() PageChanging = new EventEmitter<string>();

    constructor(private searchbarService: SearchbarService, private audioService: AudioPlayerService) {}
    cookies_accepted = localStorage.getItem("cookies_accepted") === 'true';

    ngOnInit() {
        this.searchbarService.HideSearchbar();
        this.audioService.HideAudioPlayer();
    }

    SetPageHome(page_id: string){
        this.PageChanging.emit(page_id);
    }

    UpdateGalleryImagesHome(images: string[]){
        this.update_images.emit(images);
    }
    UpdateGalleryImageIndexHome(image_index: number){
        this.update_image_index.emit(image_index);
    }
}
