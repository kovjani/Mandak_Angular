import $ from "jquery";
import {Component, OnInit, OnDestroy, HostBinding, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {MusicDTO} from "../../models/MusicDTO";
import {Subscription} from "rxjs";
import {AudioPlayerService, MusicListParams} from "../../services/audio-player.service";
import {NgClass} from "@angular/common";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-audio-player',
  standalone: true,
    imports: [
        NgClass
    ],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss'
})
export class AudioPlayerComponent implements OnInit, OnDestroy, AfterViewInit{
    @HostBinding('attr.id') id = 'audio-player-component';
    @ViewChild('audio_player') audioPlayer!: ElementRef<HTMLAudioElement>;
    @ViewChild('current_time') current_time!: ElementRef<HTMLSpanElement>;
    @ViewChild('seekbar') seekbar!: ElementRef<HTMLInputElement>;
    @ViewChild('duration') duration!: ElementRef<HTMLSpanElement>;

    private playMusicListSubscription!: Subscription;
    private setMusicListSubscription!: Subscription;
    private audioPlayerShowingSubscription!: Subscription;
    private audioPlayerHidingSubscription!: Subscription;

    private audio_player_hidden: boolean = false;
    isPlaying = false;
    actualMusicTitle: string = "";
    actualMusicEvent: string = "";
    params!: MusicListParams;

    constructor(private audioService: AudioPlayerService, private host: ElementRef, private router: Router) {}

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (this.router.url === '/events' || this.router.url === '/repertoire') {
                    this.ShowAudioPlayer();
                } else {
                    this.HideAudioPlayer();
                }
                let current_audio_from = sessionStorage.getItem("current_audio_from");
                if(this.router.url === '/repertoire' && current_audio_from === "events"){
                    $(".title").removeClass("current-audio");
                } else if(this.router.url === '/events' && current_audio_from === "repertoire"){
                    $(".events_music_title").removeClass("current-audio");
                }
            }
        });
        this.playMusicListSubscription = this.audioService.playMusicList$.subscribe((params: MusicListParams) => {
            this.PlayMusicList(params);
            this.ShowAudioPlayer();
        });
        this.setMusicListSubscription = this.audioService.setMusicList$.subscribe((params: MusicListParams) => {
            this.SetMusicList(params);
            this.ShowAudioPlayer();
        });
        this.audioPlayerShowingSubscription = this.audioService.audioPlayerShowing$.subscribe(() => {
            this.ShowAudioPlayer();
        });
        this.audioPlayerHidingSubscription = this.audioService.audioPlayerHiding$.subscribe(() => {
            this.HideAudioPlayer();
        });
    }

    ngAfterViewInit(){

        // Update the seek bar and timer as the audio plays
        this.audioPlayer.nativeElement.ontimeupdate = ()=> {
            let value = (100 / this.audioPlayer.nativeElement.duration) * this.audioPlayer.nativeElement.currentTime;
            this.seekbar.nativeElement.value = value.toString();

            // Update the styles of the music using CSS letiables
            document.documentElement.style.setProperty('--seek-bar-percentage', value + '%');

            // Update the current time display
            let currentMinutes:number = Math.floor(this.audioPlayer.nativeElement.currentTime / 60);
            let currentSeconds:number = Math.floor(this.audioPlayer.nativeElement.currentTime % 60);
            let currentSecondsStr:string = currentSeconds.toString();
            if (currentSeconds < 10) { currentSecondsStr = '0' + currentSeconds; }
            this.current_time.nativeElement.innerText = currentMinutes + ':' + currentSecondsStr;
        };

        // Update the duration display once the audio metadata is loaded
        this.audioPlayer.nativeElement.onloadedmetadata = () => {
            let totalMinutes:number = Math.floor(this.audioPlayer.nativeElement.duration / 60);
            let totalSeconds:number = Math.floor(this.audioPlayer.nativeElement.duration % 60);
            let totalSecondsStr:string = totalSeconds.toString();
            if (totalSeconds < 10) { totalSecondsStr = '0' + totalSeconds; }
            this.duration.nativeElement.innerText = totalMinutes + ':' + totalSecondsStr;
        };

        // Seek to a new position when the seek bar is changed
        this.seekbar.nativeElement.oninput = () => {
            const val = this.seekbar.nativeElement.value;
            let seek_bar_val:number = Number(val);
            let time:number = this.audioPlayer.nativeElement.duration * (seek_bar_val / 100);
            this.audioPlayer.nativeElement.currentTime = time;
        };

        this.audioPlayer.nativeElement.onended = () => {
            if(this.params.actualMusicIndex < this.params.musicList.length - 1) {
                this.params.actualMusicIndex++;
                this.PlayMusic(this.params);
            }
        };
    }

    ngOnDestroy() {
        this.playMusicListSubscription.unsubscribe();
        this.setMusicListSubscription.unsubscribe();
        this.audioPlayerShowingSubscription.unsubscribe();
        this.audioPlayerHidingSubscription.unsubscribe();
    }

    PlayAudio() {
        this.audioPlayer.nativeElement.play()
            .then(() => {
                console.log('Playback started');
                this.isPlaying = true;
            })
            .catch(error => console.error('Playback failed:', error));
    }

    PauseAudio() {
        this.audioPlayer.nativeElement.pause();
        this.isPlaying = false;
    }

    PlayNextAudio(){
        if(this.params.actualMusicIndex < this.params.musicList.length - 1) {
            this.params.actualMusicIndex++;
            this.PlayMusic(this.params);
        }
    }

    PlayPreviousAudio(){
        if(this.params.actualMusicIndex > 0) {
            this.params.actualMusicIndex--;
            this.PlayMusic(this.params);
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
        let musicEvent = actualMusic.music_event;

        this.PauseAudio();
        this.SetMusicList(params);
        this.PlayAudio();

        $(".events_music_title").removeClass("current-audio");
        $(".title").removeClass("current-audio");

        let current_audio_from = sessionStorage.getItem("current_audio_from");
        if(current_audio_from === "repertoire") {
            $(`#repertoire_title_${actualMusic.music_id}`).addClass("current-audio");
        } else if(current_audio_from === "events"){
            $(`#music_${actualMusic.music_id}_${musicEvent.event_id}`).addClass("current-audio");
        }
    }

    SetMusicList(params: MusicListParams){
        this.params = params;

        let musicList = params.musicList;
        let actualMusicIndex = params.actualMusicIndex;
        let actualMusic = musicList[actualMusicIndex];
        let musicEvent = actualMusic.music_event;

        this.audioPlayer.nativeElement.src = actualMusic.music_audio;

        if(actualMusic.music_author !== "") {
            this.actualMusicTitle = actualMusic.music_author + ": " + actualMusic.music_title;
        }
        else {
            this.actualMusicTitle = actualMusic.music_title;
        }

        this.actualMusicEvent = `${musicEvent.event_place} (${musicEvent.event_date_str})`;

       /* $(".title").removeClass("current-audio");
        $(".events_music_title").removeClass("current-audio");

        let current_audio_from = sessionStorage.getItem("current_audio_from");
        if(current_audio_from === "repertoire") {
            $(`#repertoire_title_${actualMusic.music_id}`).addClass("current-audio");
            sessionStorage.setItem("current_audio_html_id", `repertoire_title_${actualMusic.music_id}`);
        } else if(current_audio_from === "events"){
            $(`#music_${actualMusic.music_id}_${musicEvent.event_id}`).addClass("current-audio");
            sessionStorage.setItem("current_audio_html_id", `music_${actualMusic.music_id}_${musicEvent.event_id}`);
        }*/
    }

    ShowAudioPlayer() {
        this.audio_player_hidden = false;
        $(this.host.nativeElement).stop(true, true).animate({
            bottom: 0
        });
    }

    HideAudioPlayer() {
        this.audio_player_hidden = true;
        $(this.host.nativeElement).stop(true, true).animate({
            bottom: '-7em'
        });
    }

    protected readonly localStorage = localStorage;
}
