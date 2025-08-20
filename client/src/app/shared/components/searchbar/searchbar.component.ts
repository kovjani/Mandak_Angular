import $ from 'jquery';
import {Component, OnInit, OnDestroy, HostBinding, ElementRef} from '@angular/core';
import {SearchbarService} from "../../services/searchbar.service";
import {Subscription} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";

@Component({
    selector: 'app-searchbar',
    standalone: true,
    imports: [],
    templateUrl: './searchbar.component.html',
    styleUrl: './searchbar.component.scss'
})
export class SearchbarComponent implements OnInit, OnDestroy {

    private searchbarToggleSubscribtion!: Subscription;
    private searchbarShowingSubscribtion!: Subscription;
    private searchbarHidingSubscribtion!: Subscription;

    private lastScrollTop:number = 0;

    private search_bar_hidden:boolean = false;

    constructor(private searchbarService: SearchbarService, private router: Router, private host: ElementRef<HTMLElement>) {
    }

    ngOnInit() {
        this.searchbarToggleSubscribtion = this.searchbarService.SearchbarToggle$.subscribe((event:Event) => {
           this.ToggleSearchBar(event);
        });
        this.searchbarShowingSubscribtion = this.searchbarService.SearchbarShowing$.subscribe(() => {
            this.ShowSearchBar();
        });
        this.searchbarHidingSubscribtion = this.searchbarService.SearchbarHiding$.subscribe(() => {
            this.HideSearchBar();
        });

        $("#search_item").on("keypress", (event) => {
            // Handle enter pressed on searchbar.
            if(event.which === 13){
                $("#search_btn").trigger("click");
            }
        });
    }

    ngOnDestroy() {
        this.searchbarToggleSubscribtion.unsubscribe();
        this.searchbarShowingSubscribtion.unsubscribe();
        this.searchbarHidingSubscribtion.unsubscribe();
    }




    ToggleSearchBar(event: Event) {
        const target = event.target as HTMLElement;
        const st:number = target.scrollTop;

        if(st !== undefined){
            if (st > this.lastScrollTop && !this.search_bar_hidden){
                // Hide search_bar on downscroll.
                this.HideSearchBar();
            } else if (st <= this.lastScrollTop && this.search_bar_hidden){
                // Show search_bar on upscroll.
                this.ShowSearchBar();
            }
            this.lastScrollTop = st;
        }
    }

    ShowSearchBar() {
        this.search_bar_hidden = false;
        $(this.host.nativeElement).stop(true, true).animate({
            top: '3.5em'
        });
    }

    HideSearchBar() {
        this.search_bar_hidden = true;
        $(this.host.nativeElement).stop(true, true).animate({
            top: '-5em'
        });
    }
}
