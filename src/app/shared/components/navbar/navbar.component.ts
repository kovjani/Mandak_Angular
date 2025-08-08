import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import $ from 'jquery';

interface Pages {
    id: string,
    name: string
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent implements OnInit{
    @Input() actual_page_nav!: string;
    @Output() PageChanging = new EventEmitter<string>();

    admin: boolean = false;
    user_id: number | null = null;

    nav_items: Pages[] = [
        { id: "home", name: "Kezdőlap" },
        { id: "gallery", name: "Galéria" },
        { id: "repertoire", name: "KincsTár" },
        { id: "events", name: "Fellépések" },
        { id: "villa", name: "A Mandák-villa" }
    ];

    ngOnInit(): void {
        if(localStorage.getItem("nav_style") === "dark"){
            $("nav").addClass("dark_mode");
        }
        else{
            $("nav").removeClass("dark_mode");
        }
    }

    SetPageNav(page_id: string){
      this.PageChanging.emit(page_id);
      this.actual_page_nav = page_id;
    }

    Dark_mode(){
        if(localStorage.getItem("nav_style") === "dark"){
            localStorage.setItem("nav_style", "burgundy");
        }
        else{
            localStorage.setItem("nav_style", "dark");
        }
        this.SetStyle();
    }

    SetStyle(){
        if(localStorage.getItem("nav_style") === "dark"){
            $("nav").addClass("dark_mode");
            $("#nav-logo").addClass("dark_logo");
            $("footer").addClass("dark_mode");
            $('#audio-player-container').addClass("dark_mode");
        }
        else{
            $("nav").removeClass("dark_mode");
            $("#nav-logo").removeClass("dark_logo");
            $("footer").removeClass("dark_mode");
            $('#audio-player-container').removeClass("dark_mode");
        }
    }
}
