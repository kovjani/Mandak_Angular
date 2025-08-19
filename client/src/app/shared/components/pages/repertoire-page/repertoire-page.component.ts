import $ from "jquery";
import {AfterViewInit, Component, ElementRef, HostListener, inject} from '@angular/core';
import {MusicDTO} from "../../../models/MusicDTO";
import {EventDTO} from "../../../models/EventDTO";
import {AudioPlayerService, MusicListParams} from "../../../services/audio-player.service";
import {SearchbarService} from "../../../services/searchbar.service";
import {FooterComponent} from "../../footer/footer.component";
import {HttpClient} from "@angular/common/http";
import {NgClass} from "@angular/common";

@Component({
    selector: 'app-repertoire-page',
    standalone: true,
    imports: [
        FooterComponent,
        NgClass
    ],
    templateUrl: './repertoire-page.component.html',
    styleUrl: './repertoire-page.component.scss'
})
export class RepertoirePageComponent implements AfterViewInit{

    http = inject(HttpClient);
    music_list:MusicDTO[] = [];

    constructor(private audioService: AudioPlayerService, protected searchbarService: SearchbarService, private host: ElementRef<HTMLElement>) {}

    ngAfterViewInit() {
        this.searchbarService.ShowSearchbar();
        this.audioService.ShowAudioPlayer();

        $("#search_btn").off().on("click", () => {
            this.Search($("#search_item").val());
            this.host.nativeElement.scrollTop = 0;
        });
        $("#search_item").val("");
        $("#search_btn").trigger("click");
    }

    @HostListener('scroll', ['$event'])
    onScroll(event: Event){
        this.searchbarService.Toggle(event);
    }

    public PlayMusicList(music_list: MusicDTO[], music_index: number): void {

        let music = music_list[music_index];

        let params: MusicListParams = {
            musicList: music_list,
            actualMusicIndex: music_index
        }

        this.audioService.PlayMusicList(params);

        sessionStorage.setItem("current_audio_from", `repertoire`);
        sessionStorage.setItem("current_audio_html_id", `repertoire_title_${music.music_id}`);
    }

    private Search(val: any){
        let item = val !== undefined ? val.toString() : "";

        this.http.post<any[]>('http://localhost/repertoire_data', {search_item: item})
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
            // localStorage.setItem("current_music_list", JSON.stringify(music_list));

        });
    }

    //protected readonly localStorage = localStorage;
    protected readonly sessionStorage = sessionStorage;
}
