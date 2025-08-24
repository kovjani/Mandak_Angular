import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgClass} from "@angular/common";
import {AudioPlayerService} from "../../services/audio-player.service";

interface Pages {
    id: string,
    name: string
}

@Component({
    selector: 'app-navbar',
    standalone: true,
    templateUrl: './navbar.component.html',
    imports: [
        RouterLink,
        RouterLinkActive,
        NgClass
    ],
    styleUrl: './navbar.component.scss'
})

export class NavbarComponent {

    isCollapsed = true;

    nav_items: Pages[] = [
        { id: "home", name: "Kezdőlap" },
        { id: "gallery", name: "Galéria" },
        { id: "repertoire", name: "KincsTár" },
        { id: "events", name: "Fellépések" },
        { id: "villa", name: "A Mandák-villa" },
        { id: "login", name: "Bejelentkezés" }
    ];

    constructor(private audioService: AudioPlayerService) {
    }

    Dark_mode(){
        if(localStorage.getItem("nav_style") === "dark"){
            localStorage.setItem("nav_style", "burgundy");
        }
        else{
            localStorage.setItem("nav_style", "dark");
        }
    }

    ToggleAudioPlayer(){
        this.audioService.ToggleAudioPlayer();
    }

    protected readonly localStorage = localStorage;
}
