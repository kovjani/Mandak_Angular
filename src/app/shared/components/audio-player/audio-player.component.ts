import $ from "jquery";
import {Component, OnInit, OnDestroy, HostBinding} from '@angular/core';
import {Music} from "../../models/Music";
import {Subscription} from "rxjs";
import {AudioPlayerService, PlayParams} from "../../services/audio-player.service";

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss'
})
export class AudioPlayerComponent implements OnInit, OnDestroy{
    @HostBinding('attr.id') id = 'audio-player-component';

    private playAudioSubscription!: Subscription;
    private AudioPlayerShowingSubscription!: Subscription;
    private AudioPlayerHidingSubscription!: Subscription;
    private audio_player_hidden: boolean = false;

    constructor(private audioService: AudioPlayerService) {}

    ngOnInit() {
        this.playAudioSubscription = this.audioService.playAudio$.subscribe((params: PlayParams) => {
            this.play(params);
        });
        this.AudioPlayerShowingSubscription = this.audioService.AudioPlayerShowing$.subscribe(() => {
            this.ShowAudioPlayer();
        });
        this.AudioPlayerHidingSubscription = this.audioService.AudioPlayerHiding$.subscribe(() => {
            this.HideAudioPlayer();
        });
        if(localStorage.getItem("nav_style") === "dark"){
            $('#audio-player-container').addClass("dark_mode");
        }
        else{
            $('#audio-player-container').removeClass("dark_mode");
        }
    }

    ngOnDestroy() {
        this.playAudioSubscription.unsubscribe();
        this.AudioPlayerShowingSubscription.unsubscribe();
        this.AudioPlayerHidingSubscription.unsubscribe();
    }

    play(params: PlayParams) {
        let music = params.music;
        let music_index = params.music_index;

        $('#pauseButton').trigger('click');
        $('#audio_player').attr("src", music.getMusicAudio());

        $('#playButton').trigger('click');

        if(music.getMusicAuthor() !== "") {
            $("#audio_title").text(music.getMusicAuthor() + ": " + music.getMusicTitle());
        }
        else {
            $("#audio_title").text(music.getMusicTitle());
        }

        $("#audio_event").text(`${music.getMusicEventPlace()} (${music.getMusicEventDateStr()})`);
    }

    ShowAudioPlayer() {
        this.audio_player_hidden = false;
        $("#audio-player-component").stop(true, true).animate({
            bottom: 0
        });
        $("#main-page-component").addClass("main-page-audio-player-hidden");
    }

    HideAudioPlayer() {
        this.audio_player_hidden = true;
        $("#audio-player-component").stop(true, true).animate({
            bottom: '-7em'
        });
        $("#main-page-component").removeClass("main-page-audio-player-hidden");
    }

    /*public PlayEventMusicList(music_list: Music[], music_index: number, event_index: number): void {
        this.PlayAudio(music_list[music_index], music_index);

        $(".title").css("color", "black");
        $(".events_music_title").css("color", "black");
        $(`#music_${music_index}_${event_index}`).css("color", "#8fb514");

        // Remove handlers.
        $("#audio_player").off();
        $("#playNextButton").off();
        $("#playPreviousButton").off();

        $("#audio_player").on('ended', () => {
            if(music_index < music_list.length - 1){
                music_index++;
                this.PlayAudio(music_list[music_index], music_index);

                $(".title").css("color", "black");
                $(".events_music_title").css("color", "black");
                $(`#music_${music_index}_${event_index}`).css("color", "#8fb514");
            }
        });

        $("#playNextButton").click(() => {
            if(music_index < music_list.length - 1){
                music_index++;
                this.PlayAudio(music_list[music_index], music_index);

                $(".title").css("color", "black");
                $(".events_music_title").css("color", "black");
                $(`#music_${music_index}_${event_index}`).css("color", "#8fb514");
            }
        });

        $("#playPreviousButton").click(() => {
            if(music_index > 0){
                music_index--;
                this.PlayAudio(music_list[music_index], music_index);

                $(".title").css("color", "black");
                $(".events_music_title").css("color", "black");
                $(`#music_${music_index}_${event_index}`).css("color", "#8fb514");
            }
        });
    }*/
}
