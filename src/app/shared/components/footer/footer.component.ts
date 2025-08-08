import {Component, OnInit} from '@angular/core';
import $ from "jquery";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit{
    ngOnInit() {
        if(localStorage.getItem("nav_style") === "dark"){
            $("footer").addClass("dark_mode");
        }
        else{
            $("footer").removeClass("dark_mode");
        }
    }
}
