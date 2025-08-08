import {Component} from '@angular/core';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { SearchbarComponent } from "./shared/components/searchbar/searchbar.component";
import {RepertoirePageComponent} from "./shared/components/pages/repertoire-page/repertoire-page.component";
import {AudioPlayerComponent} from "./shared/components/audio-player/audio-player.component";
import {EventsPageComponent} from "./shared/components/pages/events-page/events-page.component";
import {CookieWarningComponent} from "./shared/components/cookie-warning/cookie-warning.component";
import {GalleryPageComponent} from "./shared/components/pages/gallery-page/gallery-page.component";
import {HomePageComponent} from "./shared/components/pages/home-page/home-page.component";
import {VillaPageComponent} from "./shared/components/pages/villa-page/villa-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [NavbarComponent, SearchbarComponent, RepertoirePageComponent, AudioPlayerComponent, EventsPageComponent, CookieWarningComponent, GalleryPageComponent, HomePageComponent, VillaPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{
    title = 'Mandak_angular';

    cookies_accepted = localStorage.getItem("cookies_accepted") === 'true';
    actual_page: string = "home";

    gallery_images = [
        "/assets/images/gallery/1.jpg",
        "/assets/images/gallery/2.jpg",
        "/assets/images/gallery/4.jpg",
        "/assets/images/gallery/5.jpg"
    ];
    gallery_image_index = 0;

    SetPage(page_id: string){
        this.actual_page = page_id;
    }
    UpdateGalleryImages(images: string[]){
        this.gallery_images = images;
    }
    UpdateGalleryImageIndex(image_index: number){
        this.gallery_image_index = image_index;
    }

}
