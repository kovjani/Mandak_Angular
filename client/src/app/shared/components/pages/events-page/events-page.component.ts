import {Component, HostListener, OnInit} from '@angular/core';
import {AudioPlayerService, PlayParams} from "../../../services/audio-player.service";
import {SearchbarService} from "../../../services/searchbar.service";
import $ from "jquery";
import {MusicDTO} from "../../../models/MusicDTO";
import {FooterComponent} from "../../footer/footer.component";

@Component({
  selector: 'app-events-page',
  standalone: true,
    imports: [
        FooterComponent
    ],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.scss'
})
export class EventsPageComponent implements OnInit{
    constructor(private audioService: AudioPlayerService, protected searchbarService: SearchbarService) {}

    ngOnInit() {
        this.searchbarService.ShowSearchbar();
        this.audioService.ShowAudioPlayer();
        $("#search_btn").off().on("click", () => {
            this.Search($("#search_item").val());
        });
        $("#search_item").val("");
    }

    @HostListener('scroll', ['$event'])
    onScroll(event: Event){
        this.searchbarService.Toggle(event);
    }

    public PlayMusicList(music_list: MusicDTO[], music_index: number): void {
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
        this.audioService.PlayAudio(params);

        $(".title").css("color", "black");
        $(".events_music_title").css("color", "black");
        $(`#repertoire_title_${music_index}`).css("color", "#8fb514");
    }

    private Search(val: any){
        let search_item = val !== undefined ? val.toString() : "";
        this.searchbarService.EventsSearch(search_item);
    }
}
