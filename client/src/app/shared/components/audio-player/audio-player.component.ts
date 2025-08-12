import $ from "jquery";
import {Component, OnInit, OnDestroy, HostBinding, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {MusicDTO} from "../../models/MusicDTO";
import {Subscription} from "rxjs";
import {AudioPlayerService, PlayParams} from "../../services/audio-player.service";

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss'
})
export class AudioPlayerComponent implements OnInit, OnDestroy, AfterViewInit{
    @HostBinding('attr.id') id = 'audio-player-component';
    @ViewChild('audio_player') audio_player!: ElementRef<HTMLAudioElement>;
    @ViewChild('current_time') current_time!: ElementRef<HTMLSpanElement>;
    @ViewChild('seekbar') seekbar!: ElementRef<HTMLInputElement>;
    @ViewChild('duration') duration!: ElementRef<HTMLSpanElement>;

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
    }

    ngAfterViewInit(){
        if(localStorage.getItem("nav_style") === "dark"){
            $('#audio-player-container').addClass("dark_mode");
        }
        else{
            $('#audio-player-container').removeClass("dark_mode");
        }

        $('#playButton').on('click', () => {
            this.audio_player.nativeElement.play();
            $('#playButton').hide();
            $('#pauseButton').show();
        });

        $('#pauseButton').on('click', () => {
            this.audio_player.nativeElement.pause();
            $('#pauseButton').hide();
            $('#playButton').show();
        });
        // Update the seek bar and timer as the audio plays
        this.audio_player.nativeElement.ontimeupdate = ()=> {
            let value = (100 / this.audio_player.nativeElement.duration) * this.audio_player.nativeElement.currentTime;
            this.seekbar.nativeElement.value = value.toString();



            // Update the styles of the music using CSS letiables
            document.documentElement.style.setProperty('--seek-bar-percentage', value + '%');

            // Update the current time display
            let currentMinutes:number = Math.floor(this.audio_player.nativeElement.currentTime / 60);
            let currentSeconds:number = Math.floor(this.audio_player.nativeElement.currentTime % 60);
            let currentSecondsStr:string = currentSeconds.toString();
            if (currentSeconds < 10) { currentSecondsStr = '0' + currentSeconds; }
            this.current_time.nativeElement.innerText = currentMinutes + ':' + currentSecondsStr;
        };

        // Update the duration display once the audio metadata is loaded
        this.audio_player.nativeElement.onloadedmetadata = () => {
            console.log("Hello")
            let totalMinutes:number = Math.floor(this.audio_player.nativeElement.duration / 60);
            let totalSeconds:number = Math.floor(this.audio_player.nativeElement.duration % 60);
            let totalSecondsStr:string = totalSeconds.toString();
            if (totalSeconds < 10) { totalSecondsStr = '0' + totalSeconds; }
            this.duration.nativeElement.innerText = totalMinutes + ':' + totalSecondsStr;
        };

        // Seek to a new position when the seek bar is changed
        this.seekbar.nativeElement.oninput = () => {
            const val = this.seekbar.nativeElement.value;
            let seek_bar_val:number = Number(val);
            let time:number = this.audio_player.nativeElement.duration * (seek_bar_val / 100);
            this.audio_player.nativeElement.currentTime = time;
        };
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
        this.audio_player.nativeElement.src = music.getMusicAudio();
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
