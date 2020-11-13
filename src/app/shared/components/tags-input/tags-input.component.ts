import { TagService } from './../../service/tag/tag.service';
import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tag } from '../../model/tag/tag';

@Component({
  selector: 'app-tags-input',
  templateUrl: './tags-input.component.html',
  styleUrls: ['./tags-input.component.scss']
})
export class TagsInputComponent implements OnInit {

  // input tags, cause tags will have tag from title
  @Input() tags:Tag[] = [];
  // input size : lg, sm,
  @Input() size:string = '';

  @Output() tagsEvent:EventEmitter<Tag[]> = new EventEmitter();

  tagsDB:Tag[] = [];
  tagsSuggested:Tag[] = [];

  tagForm: FormGroup;
  errorTag:boolean;

  isInputFocus:boolean = false;
  isTagsSuggestedFocus:boolean = false;


  constructor(private formBuilder: FormBuilder,
              private tagService: TagService) { }

  ngOnInit() {

    this.tagForm = this.formBuilder.group({
      tag: ['',[Validators.required]]
    });

    this.tagService.getAllTagsFromDB(
      (tags) => {
        this.tagsDB = tags;
        console.log(this.tagsDB)
      }
    );
  }


  onSuggestTags() {

    const val:string = this.formatTagName(this.tagForm.get('tag').value);

    this.tagService.getAllTagsFromDB(
      (tags) => {
        this.tagsDB = tags;
        this.tagsSuggested.splice(0, this.tagsSuggested.length);
 
        if(!val) this.tagsSuggested = Array.from(this.tagsDB);
        else if(val.length) {

          this.tagsSuggested = this.tagsDB.filter(c => this.formatTagName(c.name).startsWith(val));
                                         
          this.tagsSuggested = this.tagsSuggested.concat(this.tagsDB.filter(c => this.formatTagName(c.name)
                                                                                    .includes(val) 
                                            && !this.tagsSuggested.find((tagFind) => tagFind.id === c.id))) .slice(0,20);

          console.log(this.tagsSuggested);
        } 
      }
    );
  }

  setTagsSuggestedFocus(bool:boolean) {
    this.isTagsSuggestedFocus = bool;
  }

  setTagsSuggestedWithInputFocus() {

    this.isInputFocus = true;
    this.isTagsSuggestedFocus = true;
    this.onSuggestTags();
  }

  setTagsSuggestedWithInputFocusOut() {

    this.isInputFocus = false;
  }


  onCheckKey(key) {

    // Empêcher de saisir des caractère spéciaux et chiffre "keydown"
    const forbidCharactersRegex =  /[!@§_#$%&:=+.,£€<>^¨°\‘\“\`\'\"*\[\](){}¡∞≠æ®†Úºîœß◊©≈‹«πµ¬ﬁ¶;~ƒ∂≤≥›÷…•¿±\\ø¢√∫ı\/?]/;

    return !forbidCharactersRegex.test(key);
  }


  onAddTagSuggested(tagSuggested:Tag) {

    if(tagSuggested && tagSuggested.id 
        && !this.tags.find((tagFind) => this.formatTagName(tagFind.name) === this.formatTagName(tagSuggested.name))) {
      this.tags.push(tagSuggested);
      this.tagForm.reset();
      // close the tags suggested list
      this.isTagsSuggestedFocus = false;

      this.tagsEvent.next(this.tags);
    }
  }


  onAddTag(key) {

    //if "enter" is press add a tag
    if(key === 'Enter') {

      // get tag input value
      const tag:string = this.formatTagName(this.tagForm.get('tag').value);

      // if tag exist and fill the criteres and isn't already added
      if(tag.length  && this.isTagNameCheck(tag) && !this.tags.find((tagFind) => this.formatTagName(tagFind.name) === tag)) {

        let tagSuggestedFind = this.tagsSuggested.find((tagSuggested) => this.formatTagName(tagSuggested.name) === tag) 
                                || this.tagsDB.find((tagFind) => this.formatTagName(tagFind.name) === tag);

        // if input tag is in suggested tags or tagDB
        if(tagSuggestedFind) {

          this.onAddTagSuggested(tagSuggestedFind);

        } else {

          // if tag input isn't in tags Array
          if(!(this.tags.find((tagAdded) => this.formatTagName(tagAdded.name) === tag))) {

            // check if the input tag isn't the DB, then add new tag in DB and array
            if(!(this.tagsDB.find((tagAdded) => this.formatTagName(tagAdded.name) === tag))) {
              
              //add new tag in DB
              this.saveTagInDB(this.tagForm.get('tag').value);

            }
          }
        }
      }
    } 
  }


  // fonction pour formatter les tags (commence par majuscule, pas d'accent, en minuscule)
  formatTagName(tagName: string):string {

    if(tagName) {
      // ignore accent
      let str: string = tagName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        
      str = str.toLowerCase();

      return str;
    }
    return '';
  }


  // check if tag name fill the criteres
  isTagNameCheck(tagName: string) {

   return !this.isForbiddenTag(tagName) && tagName.length > 2;
  }


  // mot interdit comme tag sous toutes les forme (avec majuscule, etc...)
  private isForbiddenTag(str: string) {
    const forbiddenTags: string[] = ['le','la','un','une','de'];

    return forbiddenTags.find((tag) => str===tag);
    // si fait partie des tags interdits ne pas ajouter

  }


  // remove tag in local tags array
  onRemoveTag(index:number) {

    if(index> -1) {
      console.log(this.tags);
      this.tags.splice(index, 1);
    }
  }

  
  // save tag in DB
  private saveTagInDB(newTagName:string) {

    if(newTagName && newTagName.length) {

      this.tagService.addTagInDB(new Tag(null, newTagName, []), 
        (tagSaved:Tag) => {

          //clear tagsDB
          console.log('saveTagInDB',tagSaved);
          this.tagsDB.splice(0, this.tagsDB.length);
          this.tagsDB = Array.from(this.tagService.tags);
          this.tags.push(tagSaved);
          this.tagForm.reset();
          this.tagsEvent.next(this.tags);
        }
      );
    }
  }


  // check a formated tag is in DB in real time
  isTagsSuggestedList() {
    return (this.isTagsSuggestedFocus || this.isInputFocus);
  }


}
