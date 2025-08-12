import $ from "jquery";
import {AfterViewInit, Component, ElementRef, HostListener, inject} from '@angular/core';
import {MusicDTO} from "../../../models/MusicDTO";
import {EventDTO} from "../../../models/EventDTO";
import {AudioPlayerService, PlayParams} from "../../../services/audio-player.service";
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
        $("#search_btn").trigger("click");
        $("#search_item").val("");

        /*let saved_music_index = localStorage.getItem('current_music_index');
        let saved_music_list = localStorage.getItem("current_music_list");
        if (saved_music_index && saved_music_list) {
            let music_index:number = JSON.parse(saved_music_index);
            let music_list:MusicDTO[] = JSON.parse(saved_music_list);
            this.PlayMusicList(music_list, music_index);
            setTimeout(() => {
                $('#pauseButton').trigger('click');
            }, 100);
        }*/

    }

    @HostListener('scroll', ['$event'])
    onScroll(event: Event){
        this.searchbarService.Toggle(event);
    }

    public PlayMusicList(music_list: MusicDTO[], music_index: number): void {
        this.PlayAudio(music_list[music_index], music_index);
        $("#audio_player").off().on('ended', () => {
            if(music_index < music_list.length - 1){
                music_index++;
                this.PlayAudio(music_list[music_index], music_index);
            }
        });

        $("#playNextButton").off().on('click', () => {
            if(music_index < music_list.length - 1){
                music_index++;
                this.PlayAudio(music_list[music_index], music_index);
            }
        });

        $("#playPreviousButton").off().on('click', () => {
            if(music_index > 0){
                music_index--;
                this.PlayAudio(music_list[music_index], music_index);
            }
        });
    }

    private PlayAudio(music: MusicDTO, music_index: number){
        let params: PlayParams = {
            music: music,
            music_index: music_index
        }
        this.audioService.PlayAudio(params)

        $(".title").css("color", "black");
        $(".events_music_title").css("color", "black");
        $(`#repertoire_title_${music_index}`).css("color", "#8fb514");

        //localStorage.setItem("current_music_index", JSON.stringify(music_index));
        sessionStorage.setItem("current_audio_html_id", `repertoire_title_${music_index}`);
    }

    private Search(val: any){
        let item = val !== undefined ? val.toString() : "";

        this.http.post<any[]>('http://localhost/repertoire_data', {search_item: item})
            .subscribe((repertoire_result) => {

                let music_list: MusicDTO[] = [];

                for (let i = 0; i < repertoire_result.length; i++) {
                    let res = repertoire_result[i];
                    let event = new EventDTO(res.place, res.date, res.local_folder);
                    if(res.author !== "") {
                        music_list.push(new MusicDTO(res.id, res.title, event, res.author));
                    } else {
                        music_list.push(new MusicDTO(res.id, res.title, event, res.author));
                    }
                }

                this.music_list = music_list;
                // localStorage.setItem("current_music_list", JSON.stringify(music_list));

            }
        );
    }

    //protected readonly localStorage = localStorage;
    protected readonly sessionStorage = sessionStorage;
}
