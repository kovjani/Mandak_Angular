import { EventDTO } from "./EventDTO";

export class MusicDTO {

    private music_id: number;
    private music_title: string;
    private music_author: string = "";
    private music_audio: string; // The audio file.
    private music_event: EventDTO;

    //public constructor(music_id: number, music_title: string);
    public constructor(music_id: number, music_title: string, music_event: EventDTO, music_author?: string) {
        this.music_id = music_id;
        this.music_title = music_title;
        this.music_event = music_event;

        if(music_author){
            this.music_author = music_author;
            this.music_audio = `/assets/events/${music_event.getEventFolder()}/audio/${music_author}_${music_title}.mp3`;
        } else {
            this.music_audio = `/assets/events/${music_event.getEventFolder()}/audio/${music_title}.mp3`;
        }

    }

    public getMusicId(): number {
        return this.music_id;
    }

    public getMusicTitle(): string {
        return this.music_title;
    }

    public getMusicAuthor(): string {
        return this.music_author;
    }

    public getMusicAudio(): string {
        return this.music_audio;
    }

    public getMusicEvent(): EventDTO {
        return this.music_event;
    }

    public getMusicEventPlace(): string {
        return this.music_event.getEventPlace();
    }

    public getMusicEventDate(): Date {
        return this.music_event.getEventDate();
    }

    public getMusicEventDateStr(): string {
        return this.music_event.getEventDateStr();
    }

    public getMusicEventFolder(): string {
        return this.music_event.getEventFolder();
    }
}
