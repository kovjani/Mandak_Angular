import $ from 'jquery';
import {Component, OnInit, OnDestroy, HostBinding} from '@angular/core';
import {SearchbarService} from "../../services/searchbar.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-searchbar',
    standalone: true,
    imports: [],
    templateUrl: './searchbar.component.html',
    styleUrl: './searchbar.component.scss'
})
export class SearchbarComponent implements OnInit, OnDestroy {
    @HostBinding('attr.id') id = 'searchbar-component';
    private repertoireSearchingSubscribtion!: Subscription;
    private eventsSearchingSubscribtion!: Subscription;
    private searchbarToggleSubscribtion!: Subscription;
    private searchbarShowingSubscribtion!: Subscription;
    private searchbarHidingSubscribtion!: Subscription;

    private lastScrollTop:number = 0;

    private search_bar_hidden:boolean = false;

    constructor(private searchbarService: SearchbarService) {
    }

    ngOnInit() {
        this.repertoireSearchingSubscribtion = this.searchbarService.RepertoireSearching$.subscribe((search_item: string) => {
           this.RepertoireSearch(search_item);
        });
        this.eventsSearchingSubscribtion = this.searchbarService.EventsSearching$.subscribe((search_item: string) => {
            this.EventsSearch(search_item);
        });
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
        this.repertoireSearchingSubscribtion.unsubscribe();
        this.eventsSearchingSubscribtion.unsubscribe();
        this.searchbarToggleSubscribtion.unsubscribe();
        this.searchbarShowingSubscribtion.unsubscribe();
        this.searchbarHidingSubscribtion.unsubscribe();
    }

    RepertoireSearch(search_item: string){console.log("Repertoire: " + search_item);}
    EventsSearch(search_item: string){console.log("Events: " + search_item);}

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
        $("#searchbar-component").stop(true, true).animate({
            top: '3.5em'
        });
    }

    HideSearchBar() {
        this.search_bar_hidden = true;
        $("#searchbar-component").stop(true, true).animate({
            top: '-5em'
        });
    }
}
