import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    inject, QueryList,
    ViewChildren
} from '@angular/core';
import $ from "jquery";
import {AudioPlayerService, MusicListParams} from "../../../services/audio-player.service";
import {SearchbarService} from "../../../services/searchbar.service";
import {MusicDTO} from "../../../models/MusicDTO";
import {EventDTO} from "../../../models/EventDTO";
import {FooterComponent} from "../../footer/footer.component";
import {HttpClient} from "@angular/common/http";
import {NgClass} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-events-page',
  standalone: true,
    imports: [
        FooterComponent,
        NgClass
    ],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.scss'
})
export class EventsPageComponent implements AfterViewInit{
    @ViewChildren('details') detailsHtmlElements!: QueryList<HTMLElement>;
    @ViewChildren('cover') coverHtmlElements!: QueryList<HTMLElement>;
    @ViewChildren('title_place_date') title_place_dateHtmlElements!: QueryList<HTMLElement>;

    http = inject(HttpClient);
    events_list: EventDTO[] = [];
    cover_hover_index:any = null;
    //event_images: string[] = [];
    //event_music_list: MusicDTO[] = [];

    constructor(private audioService: AudioPlayerService, protected searchbarService: SearchbarService, private host: ElementRef<HTMLElement>, private router: Router) {}

    ngAfterViewInit() {
        this.Search("");
        this.searchbarService.ShowSearchbar();
        this.audioService.ShowAudioPlayer();
        $("#search_btn").off().on("click", () => {
            this.Search($("#search_item").val());
            this.host.nativeElement.scrollTop = 0;
        });
        $("#search_item").val("");
    }

    @HostListener('scroll', ['$event'])
    onScroll(event: Event){
        this.searchbarService.Toggle(event);
    }

    public PlayMusicList(event_index: number, music_index: number): void {
        let event_item = this.events_list[event_index];
        let music_list = event_item.event_music_list;
        let music = music_list[music_index];

        let params: MusicListParams = {
            musicList: music_list,
            actualMusicIndex: music_index
        }

        this.audioService.PlayMusicList(params);

        sessionStorage.setItem("current_audio_from", `events`);
        sessionStorage.setItem("current_audio_html_id", `music_${music.music_id}_${event_item.event_id}`);
    }

    private Search(val: any){
        let item = val !== undefined ? val.toString() : "";
        this.http.post<any[]>("http://localhost/events_data", {search_item: item})
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

        if(this.events_list[event_index].event_images.length === 0){
            let event_images:string[] = [];
            this.http.post<any[]>("http://localhost/get_local_images", {event_id: event_item.event_id})
                .subscribe((result) => {
                    for (let j = 0; j < result.length; j++) {
                        event_images.push(result[j].image_url.toString());
                    }
                });
            this.events_list[event_index].event_images = event_images;
        }

        if(this.events_list[event_index].event_music_list.length === 0){
            let event_music_list:MusicDTO[] = [];
            this.http.post<any[]>("http://localhost/music_to_event", {event_id: event_item.event_id})
                .subscribe((result) => {
                    for (let j = 0; j < result.length; j++) {
                        if(result[j].author !== "") {
                            event_music_list.push(new MusicDTO(result[j].id, result[j].title, event_item, result[j].author));
                        } else {
                            event_music_list.push(new MusicDTO(result[j].id, result[j].title, event_item));
                        }
                    }
                });
            this.events_list[event_index].event_music_list = event_music_list;
        }

        //if(event_item.event_description !== null && event_item.event_description.length > 1){
           setTimeout(() => {
               $(details_element).slideToggle("fast");
               cover_element.classList.toggle("hide_bottom_radius");
               title_place_date_element.classList.toggle("hide_bottom_radius");
           }, 100);
        //}
    }

    ViewInGallery(images: string[], index: number){
        images = images.map(image => "/assets" + image);
        this.router.navigate(['/gallery'], {queryParams: {images: JSON.stringify(images), index: index}});
    }

    protected readonly sessionStorage = sessionStorage;
}
