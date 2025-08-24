import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-searchbar',
    standalone: true,
    imports: [],
    templateUrl: './searchbar.component.html',
    styleUrl: './searchbar.component.scss'
})
export class SearchbarComponent {

    @Input() searchFunction!: Function;

    Search(val: any){
        this.searchFunction(val);
    }

}
