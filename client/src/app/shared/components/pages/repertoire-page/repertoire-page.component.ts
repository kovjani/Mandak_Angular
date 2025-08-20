import $ from "jquery";
import {AfterViewInit, Component, ElementRef, HostListener, inject} from '@angular/core';
import {MusicDTO} from "../../../models/MusicDTO";
import {EventDTO} from "../../../models/EventDTO";
import {AudioPlayerService, MusicListParams} from "../../../services/audio-player.service";
import {SearchbarService} from "../../../services/searchbar.service";
import {FooterComponent} from "../../footer/footer.component";
import {HttpClient} from "@angular/common/http";
import {NavigationEnd, Router} from "@angular/router";
import {SearchbarComponent} from "../../searchbar/searchbar.component";
import {ApiService} from "../../../services/api.service";

@Component({
    selector: 'app-repertoire-page',
    standalone: true,
    imports: [
        FooterComponent,
        SearchbarComponent
    ],
    templateUrl: './repertoire-page.component.html',
    styleUrl: './repertoire-page.component.scss'
})
export class RepertoirePageComponent implements AfterViewInit{

    http = inject(HttpClient);
    music_list:MusicDTO[] = [];

    constructor(private apiService: ApiService,
                private audioService: AudioPlayerService,
                protected searchbarService: SearchbarService,
                private host: ElementRef<HTMLElement>,
                private router: Router) {}

    ngAfterViewInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (this.router.url === '/repertoire') {
                    let scrollTopFromSession = sessionStorage.getItem("repertoireScrollTop");
                    if(scrollTopFromSession) {
                        this.host.nativeElement.scrollTop = parseInt(scrollTopFromSession);
                    }
                    setTimeout(() => {
                        this.searchbarService.ShowSearchbar();
                    }, 100);
                }
            }
        });
        $("#search_btn").off().on("click", () => {
            this.Search($("#search_item").val());
            this.host.nativeElement.scrollTop = 0;
            sessionStorage.setItem("repertoireScrollTop", "0");
        });
        this.Search("");
    }

    @HostListener('scroll', ['$event'])
    onScroll(event: Event){
        this.searchbarService.Toggle(event);
        sessionStorage.setItem("repertoireScrollTop", this.host.nativeElement.scrollTop.toString());
    }

    public PlayMusicList(music_list: MusicDTO[], music_index: number): void {

        let music = music_list[music_index];

        let params: MusicListParams = {
            musicList: music_list,
            actualMusicIndex: music_index
        }

        sessionStorage.setItem("current_audio_from", `repertoire`);

        this.audioService.PlayMusicList(params);

    }

    private Search(val: any){
        let item = val !== undefined ? val.toString() : "";

        this.apiService.postData('repertoire_data', {search_item: item})
        .subscribe((repertoire_result) => {

            let music_list: MusicDTO[] = [];

            for (let i = 0; i < repertoire_result.length; i++) {
                let res = repertoire_result[i];
                let event = new EventDTO(res.event_id, res.date, res.place, res.conductor, res.event, res.description, res.local_folder, res.cover_image);
                if(res.author !== "") {
                    music_list.push(new MusicDTO(res.music_id, res.title, event, res.author));
                } else {
                    music_list.push(new MusicDTO(res.music_id, res.title, event));
                }
            }

            this.music_list = music_list;

            // TODO
            //this.audioService.SetMusicList();

            // localStorage.setItem("current_music_list", JSON.stringify(music_list));

        });
    }
}
