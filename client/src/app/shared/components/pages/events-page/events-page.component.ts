import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    inject, OnDestroy, OnInit, QueryList,
    ViewChildren
} from '@angular/core';
import $ from "jquery";
import {AudioPlayerService, MusicListParams} from "../../../services/audio-player.service";
import {MusicDTO} from "../../../models/MusicDTO";
import {EventDTO} from "../../../models/EventDTO";
import {FooterComponent} from "../../footer/footer.component";
import {HttpClient} from "@angular/common/http";
import {NgClass} from "@angular/common";
import {NavigationEnd, Router} from "@angular/router";
import {SearchbarComponent} from "../../searchbar/searchbar.component";
import {ApiService} from "../../../services/api.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-events-page',
  standalone: true,
    imports: [
        FooterComponent,
        NgClass,
        SearchbarComponent
    ],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.scss'
})
export class EventsPageComponent implements AfterViewInit, OnInit, OnDestroy {
    @ViewChildren('details') detailsHtmlElements!: QueryList<HTMLElement>;
    @ViewChildren('cover') coverHtmlElements!: QueryList<HTMLElement>;
    @ViewChildren('title_place_date') title_place_dateHtmlElements!: QueryList<HTMLElement>;

    http = inject(HttpClient);
    events_list: EventDTO[] = [];
    cover_hover_index:number = -1;

    private audioPlayerShowingSubscription!: Subscription;
    private audioPlayerHidingSubscription!: Subscription;

    protected isSearchBarHidden: boolean = false;
    private lastScrollTop:number = 0;

    constructor(private apiService: ApiService,
                private audioService: AudioPlayerService,
                private host: ElementRef<HTMLElement>,
                private router: Router) {}

    ngAfterViewInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (this.router.url === '/events') {
                    let scrollTopFromSession = sessionStorage.getItem("eventsScrollTop");
                    if(scrollTopFromSession) {
                        this.host.nativeElement.scrollTop = parseInt(scrollTopFromSession);
                    }
                    this.isSearchBarHidden = false;
                }
            }
        });
        this.Search("");
    }

    ngOnInit() {
        this.audioPlayerShowingSubscription = this.audioService.audioPlayerShowing$.subscribe(() => {
            this.host.nativeElement.classList.add("with-audio-player");
        });
        this.audioPlayerHidingSubscription = this.audioService.audioPlayerHiding$.subscribe(() => {
            this.host.nativeElement.classList.remove("with-audio-player");
        });
    }

    ngOnDestroy() {
        this.audioPlayerShowingSubscription.unsubscribe();
        this.audioPlayerHidingSubscription.unsubscribe();
    }

    @HostListener('scroll', ['$event'])
    onScroll(event: Event){
        const target = event.target as HTMLElement;
        const st:number = target.scrollTop;

        if(st !== undefined){
            if (st > this.lastScrollTop && !this.isSearchBarHidden){
                // Hide search_bar on downscroll.
                this.isSearchBarHidden = true;
            } else if (st <= this.lastScrollTop && this.isSearchBarHidden){
                // Show search_bar on upscroll.
                this.isSearchBarHidden = false;
            }
            this.lastScrollTop = st;
        }
        sessionStorage.setItem("eventsScrollTop", this.host.nativeElement.scrollTop.toString());
    }

    public PlayMusicList(event_index: number, music_index: number): void {
        let event_item = this.events_list[event_index];
        let music_list = event_item.event_music_list;
        let music = music_list[music_index];

        let params: MusicListParams = {
            musicList: music_list,
            actualMusicIndex: music_index
        }

        sessionStorage.setItem("current_audio_from", `events`);

        this.audioService.PlayMusicList(params);
    }

    protected Search(val: any){
        this.host.nativeElement.scrollTop = 0;
        sessionStorage.setItem("eventsScrollTop", "0");

        let item = val !== undefined ? val.toString() : "";
        this.apiService.postData("events_data", {search_item: item})
        .subscribe((events_result) => {
            this.events_list = [];
            for (let i = 0; i < events_result.length; i++) {
                let res = events_result[i];
                let event = new EventDTO(res.id, res.date, res.place, res.conductor, res.event, res.description, res.local_folder, res.cover_image);
                this.events_list.push(event);
            }
        });

        setTimeout(() => {
            this.detailsHtmlElements.forEach(e => {
                // @ts-ignore
                $(e.nativeElement).hide();
            });
            this.coverHtmlElements.forEach(e => {
                // @ts-ignore
                e.nativeElement.classList.remove("hide_bottom_radius");
            });
            this.title_place_dateHtmlElements.forEach(e => {
                // @ts-ignore
                e.nativeElement.classList.remove("hide_bottom_radius");
            });
        }, 100);

    }

    GetImageUrl(image: string): string {
        return `url("/assets${encodeURIComponent(image)}")`;
    }

    CoverClicked(details_element: HTMLElement, cover_element: HTMLElement, title_place_date_element: HTMLElement, event_item: EventDTO){
        let event_index = this.events_list.indexOf(event_item);

        if(this.events_list[event_index].event_images !== null && this.events_list[event_index].event_images.length === 0){
            let event_images:string[] = [];
            this.apiService.postData("get_local_images", {event_id: event_item.event_id})
                .subscribe((result) => {
                    if(result !== null){
                        for (let j = 0; j < result.length; j++) {
                            event_images.push(result[j].image_url.toString());
                        }
                    }
                });
            this.events_list[event_index].event_images = event_images;
        }

        if(this.events_list[event_index].event_music_list !== null && this.events_list[event_index].event_music_list.length === 0){
            let event_music_list:MusicDTO[] = [];
            this.apiService.postData("music_to_event", {event_id: event_item.event_id})
                .subscribe((result) => {
                    if(result !== null){
                        for (let j = 0; j < result.length; j++) {
                            if(result[j].author !== "") {
                                event_music_list.push(new MusicDTO(result[j].id, result[j].title, event_item, result[j].author));
                            } else {
                                event_music_list.push(new MusicDTO(result[j].id, result[j].title, event_item));
                            }
                        }
                    }
                });
            this.events_list[event_index].event_music_list = event_music_list;
        }

        setTimeout(() => {
           if((event_item.event_description !== null && event_item.event_description.length > 1) ||
               (this.events_list[event_index].event_images !== null && this.events_list[event_index].event_images.length > 0) ||
               (this.events_list[event_index].event_music_list !== null &&this.events_list[event_index].event_music_list.length > 0)) {

               $(details_element).slideToggle("fast");
               cover_element.classList.toggle("hide_bottom_radius");
               title_place_date_element.classList.toggle("hide_bottom_radius");
           }
        }, 100);
    }

    ViewInGallery(images: string[], index: number){
        images = images.map(image => "/assets" + image);
        this.router.navigate(['/gallery'], {queryParams: {images: JSON.stringify(images), index: index}});
    }
}
