import {AfterViewInit, Component, ElementRef, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {MusicDTO} from "../../../models/MusicDTO";
import {EventDTO} from "../../../models/EventDTO";
import {AudioPlayerService, MusicListParams} from "../../../services/audio-player.service";
import {FooterComponent} from "../../footer/footer.component";
import {HttpClient} from "@angular/common/http";
import {NavigationEnd, Router} from "@angular/router";
import {SearchbarComponent} from "../../searchbar/searchbar.component";
import {ApiService} from "../../../services/api.service";
import {NgClass} from "@angular/common";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-repertoire-page',
    standalone: true,
    imports: [
        FooterComponent,
        SearchbarComponent,
        NgClass
    ],
    templateUrl: './repertoire-page.component.html',
    styleUrl: './repertoire-page.component.scss'
})
export class RepertoirePageComponent implements AfterViewInit, OnInit, OnDestroy{

    http = inject(HttpClient);
    music_list:MusicDTO[] = [];

    protected isSearchBarHidden: boolean = false;
    private lastScrollTop:number = 0;

    private audioPlayerShowingSubscription!: Subscription;
    private audioPlayerHidingSubscription!: Subscription;

    constructor(private apiService: ApiService,
                private audioService: AudioPlayerService,
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

    protected Search(val: any){
        this.host.nativeElement.scrollTop = 0;
        sessionStorage.setItem("repertoireScrollTop", "0");

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
