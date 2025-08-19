import $ from "jquery";
import {Component, OnInit, OnDestroy, HostBinding, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {MusicDTO} from "../../models/MusicDTO";
import {Subscription} from "rxjs";
import {AudioPlayerService, MusicListParams} from "../../services/audio-player.service";

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

    private playMusicListSubscription!: Subscription;
    private setMusicListSubscription!: Subscription;
    private audioPlayerShowingSubscription!: Subscription;
    private audioPlayerHidingSubscription!: Subscription;
    private audio_player_hidden: boolean = false;

    constructor(private audioService: AudioPlayerService, private host: ElementRef) {}

    ngOnInit() {
        this.playMusicListSubscription = this.audioService.playMusicList$.subscribe((params: MusicListParams) => {
            this.PlayMusicList(params);
        });
        this.setMusicListSubscription = this.audioService.setMusicList$.subscribe((params: MusicListParams) => {
            this.SetMusicList(params);
        });
        this.audioPlayerShowingSubscription = this.audioService.audioPlayerShowing$.subscribe(() => {
            this.ShowAudioPlayer();
        });
        this.audioPlayerHidingSubscription = this.audioService.audioPlayerHiding$.subscribe(() => {
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
        this.playMusicListSubscription.unsubscribe();
        this.setMusicListSubscription.unsubscribe();
        this.audioPlayerShowingSubscription.unsubscribe();
        this.audioPlayerHidingSubscription.unsubscribe();
    }

    SetMusicList(params: MusicListParams){
        this.SetMusic(params);

        $("#audio_player").off().on('ended', () => {
            if(params.actualMusicIndex < params.musicList.length - 1){
                params.actualMusicIndex++;
                this.PlayMusic(params);
            }
        });

        $("#playNextButton").off().on('click', () => {
            if(params.actualMusicIndex < params.musicList.length - 1){
                params.actualMusicIndex++;
                this.PlayMusic(params);
            }
        });

        $("#playPreviousButton").off().on('click', () => {
            if(params.actualMusicIndex > 0){
                params.actualMusicIndex--;
                this.PlayMusic(params);
            }
        });
    }

    SetMusic(params: MusicListParams){
        let musicList = params.musicList;
        let actualMusicIndex = params.actualMusicIndex;
        let actualMusic = musicList[actualMusicIndex];
        let musicEvent = actualMusic.music_event;

        this.audio_player.nativeElement.src = actualMusic.music_audio;

        if(actualMusic.music_author !== "") {
            $("#audio_title").text(actualMusic.music_author + ": " + actualMusic.music_title);
        }
        else {
            $("#audio_title").text(actualMusic.music_title);
        }

        $("#audio_event").text(`${musicEvent.event_place} (${musicEvent.event_date_str})`);

        $(".title").removeClass("current-audio");
        $(".events_music_title").removeClass("current-audio");

        let current_audio_from = sessionStorage.getItem("current_audio_from");
        if(current_audio_from === "repertoire") {
            $(`#repertoire_title_${actualMusic.music_id}`).addClass("current-audio");
        } else if(current_audio_from === "events"){
            $(`#music_${actualMusic.music_id}_${musicEvent.event_id}`).addClass("current-audio");
        }
    }

    PlayMusicList(params: MusicListParams): void {
        this.SetMusicList(params);
        this.PlayMusic(params);
    }

    PlayMusic(params: MusicListParams) {
        let musicList = params.musicList;
        let actualMusicIndex = params.actualMusicIndex;
        let actualMusic = musicList[actualMusicIndex];

        $('#pauseButton').trigger('click');
        this.SetMusic(params);
        $('#playButton').trigger('click');
    }

    ShowAudioPlayer() {
        this.audio_player_hidden = false;
        $(this.host.nativeElement).stop(true, true).animate({
            bottom: 0
        });
        $("#main-page-component").addClass("main-page-audio-player-hidden");
    }

    HideAudioPlayer() {
        this.audio_player_hidden = true;
        $(this.host.nativeElement).stop(true, true).animate({
            bottom: '-7em'
        });
        $("#main-page-component").removeClass("main-page-audio-player-hidden");
    }
}
