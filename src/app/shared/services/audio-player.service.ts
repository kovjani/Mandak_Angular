import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Music} from "../models/Music";

export interface PlayParams{
    music: Music;
    music_index: number;
}

@Injectable({providedIn: 'root'})
export class AudioPlayerService {

    private playAudioSource = new Subject<PlayParams>();
    playAudio$ = this.playAudioSource.asObservable();

    PlayAudio(params: PlayParams) {
        this.playAudioSource.next(params);
    }

    private AudioPlayerShowingSource = new Subject<void>();
    AudioPlayerShowing$ = this.AudioPlayerShowingSource.asObservable();

    ShowAudioPlayer(){
        this.AudioPlayerShowingSource.next();
    }

    private AudioPlayerHidingSource = new Subject<void>();
    AudioPlayerHiding$ = this.AudioPlayerHidingSource.asObservable();

    HideAudioPlayer(){
        this.AudioPlayerHidingSource.next();
    }
}
