import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {MusicDTO} from "../models/MusicDTO";

export interface MusicListParams{
    musicList: MusicDTO[];
    actualMusicIndex: number;
}

@Injectable({providedIn: 'root'})
export class AudioPlayerService {

    private playMusicListSource = new Subject<MusicListParams>();
    private setMusicListSource = new Subject<MusicListParams>();
    private audioPlayerShowingSource = new Subject<void>();
    private audioPlayerHidingSource = new Subject<void>();
    private audioPlayerToggleSource = new Subject<void>();

    playMusicList$ = this.playMusicListSource.asObservable();
    setMusicList$ = this.setMusicListSource.asObservable();
    audioPlayerShowing$ = this.audioPlayerShowingSource.asObservable();
    audioPlayerHiding$ = this.audioPlayerHidingSource.asObservable();
    audioPlayerToggle$ = this.audioPlayerToggleSource.asObservable();

    PlayMusicList(params: MusicListParams) {
        this.playMusicListSource.next(params);
    }

    SetMusicList(params: MusicListParams) {
        this.setMusicListSource.next(params);
    }

    ShowAudioPlayer(){
        this.audioPlayerShowingSource.next();
    }

    HideAudioPlayer(){
        this.audioPlayerHidingSource.next();
    }

    ToggleAudioPlayer(){
        this.audioPlayerToggleSource.next();
    }
}
