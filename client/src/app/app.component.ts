import {Component} from '@angular/core';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { SearchbarComponent } from "./shared/components/searchbar/searchbar.component";
import {AudioPlayerComponent} from "./shared/components/audio-player/audio-player.component";
import {CookieWarningComponent} from "./shared/components/cookie-warning/cookie-warning.component";
import {Router, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [NavbarComponent, SearchbarComponent, AudioPlayerComponent, CookieWarningComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{
    title = 'Mandak_angular';

    cookies_accepted = localStorage.getItem("cookies_accepted") === 'true';
    actual_page: string = '/home';

    constructor(private router: Router) {
        this.actual_page = this.router.url;
        this.router.events.subscribe(() => {
            this.actual_page = this.router.url;
        });
    }
}
