import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {MusicDTO} from "../models/MusicDTO";

export interface PlayParams{
    music: MusicDTO;
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
