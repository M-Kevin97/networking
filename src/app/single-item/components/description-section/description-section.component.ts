import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-description-section',
  templateUrl: './description-section.component.html',
  styleUrls: ['./description-section.component.css']
})
export class DescriptionSectionComponent implements OnInit {

  @Input() description:string;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Si la taille de description est supérieur à 200, retourner vrai, sinon retourner false
   */
  checkLengthDescription() {
    if(this.description && this.description.length > 200){
      return true;
    }
    else 
    {
      return false;
    }
  }

  getDescriptionBeginning() {
    if(this.description){
      return this.description.substring(0, 160);
    }
  }

  getDescriptionEnding() {
    if(this.description){
      return this.description.substring(160);
    }
  }

  seeMore() {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var btnText = document.getElementById("btnSeeMore");
  
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "+ Voir plus";
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "- Voir moins";
      moreText.style.display = "inline";
    }
  }

}
