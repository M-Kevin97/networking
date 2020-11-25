import { DatePipe } from '@angular/common';
import { UserLevel } from 'src/app/shared/model/UserLevel.enum';
import { UserSelectComponent } from 'src/app/shared/components/user-select/user-select.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import * as firebase from 'firebase';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Database } from 'src/app/core/database/database.enum';
import { Category } from 'src/app/shared/model/category/category';
import { Course } from 'src/app/shared/model/item/course';
import { CategoryService } from 'src/app/shared/service/category/category.service';
import { ImageService } from 'src/app/shared/service/image/image.service';
import { User } from 'src/app/shared/model/user/user';
import { UserService } from 'src/app/shared/service/user/user.service';
import { ItemService } from 'src/app/shared/service/item/item.service';
import { CategoriesSelectComponent, SelectType } from 'src/app/shared/components/categories-select/categories-select.component';
import { AuthService } from 'src/app/core/auth/auth.service';


@Component({
  selector: 'app-new-element',
  templateUrl: './new-element.component.html',
  styleUrls: ['./new-element.component.scss']
})
export class NewElementComponent implements OnInit {

  // les différents formulaires
  categoryForm: FormGroup;
  subcategoryForm: FormGroup;
  courseForm: FormGroup;
  userForm: FormGroup;

  // Formateur sélectionné
  userSelected:User;
  userSelectedId:string='';
  userValues:User[];

  // Catégorie sélectionné
  categorySelected:Category;
  subCategorySelected:Category;
  categorySelectedForSub:Category;
  categorySelectedId:string='';
  subCategorySelectedId:string='';

  categoryValues:Category[];
  subCategoryValues:Category[] = [];

  // image
  file: File;
  urlImagePreview: string;
  uploadedImage: File;

  // variable pour la barre de navigation (Formation, Catégorie, Formateur)
  activeTab = 'course';

  // Subscription
  private userSubscription: Subscription;
  private categorySubscription: Subscription;
  private imagePreviewSubscription: Subscription;

  @ViewChild(UserSelectComponent) userSelectComponent: UserSelectComponent;
  @ViewChild(CategoriesSelectComponent) categorySelectComponent: CategoriesSelectComponent;
  @ViewChild(CategoriesSelectComponent) subCategorySelectComponent: CategoriesSelectComponent;
  @ViewChild(CategoriesSelectComponent) categoryForSubSelectComponent: CategoriesSelectComponent;

  constructor(private formBuilder:FormBuilder,
              private categoryService: CategoryService,
              private userService: UserService,
              private authService:AuthService,
              private itemService: ItemService,
              private imageService: ImageService,
              private datePipe:DatePipe) { 

    this.courseForm = this.formBuilder.group({
      courseTitle: ['',[Validators.required]],
      courseCatchPhrase : ['',[Validators.required]],
      courseDescription: ['',[Validators.required]],
      coursePrice: ['',[Validators.required]],
      courseImageLink: [''],
    });

    this.categoryForm = this.formBuilder.group({
      categoryName: ['',[Validators.required]],
    });

    this.subcategoryForm = this.formBuilder.group({
      subcategoryName: ['',[Validators.required]],
    });

    this.userForm = this.formBuilder.group({
      userFirstname: ['',[Validators.required]],
      userLastname: ['',[Validators.required]],
      userTitle: ['',[Validators.required]],
      userBio: ['',[Validators.required]],
      userWebSiteLink: ['',[Validators.required]],
    });
  }

  ngOnInit() {
    this.getInstructorsFromService();
    this.getCategoriesFromService();
    this.getImagePreviewFromService();
  }

  ngAfterViewInit() {
    this.courseForm.addControl('instructorSelectForm', this.userSelectComponent.userSelectForm);
    this.userSelectComponent.userSelectForm.setParent(this.courseForm);

    this.courseForm.addControl('categorySelectForm', this.categorySelectComponent.categorySelectForm);
    this.categorySelectComponent.categorySelectForm.setParent(this.courseForm);

    this.courseForm.addControl('subCategorySelectForm', this.subCategorySelectComponent.categorySelectForm);
    this.subCategorySelectComponent.categorySelectForm.setParent(this.courseForm);

    this.subcategoryForm.addControl('categoryForSubSelectForm', this.categoryForSubSelectComponent.categorySelectForm);
    this.categoryForSubSelectComponent.categorySelectForm.setParent(this.subcategoryForm);
  }

  getImagePreviewFromService(){

    console.log('getImagePreviewFromService ItemMediaFormComponent');

    this.imagePreviewSubscription = this.imageService.imageSubject
    .subscribe(
      (data:string) => {
        console.log('imagePreviewSubscription :', data);
        this.urlImagePreview = data;
      },
      (err: string) => console.error('Observer got an error: ' + err),
      () => {
        console.log('Observer got a complete notification');
      }
    );
  }

  getInstructorsFromService(){

    console.log('getInstructorsFromService');
    
    this.userSubscription = this.userService.usersSubject
    .subscribe(
      (data:User[]) => {

        console.warn(data);
        this.userValues = data
        this.userSelected = this.userValues ? this.userValues[0] : null;
        this.userSelectedId = this.userSelected ? this.userSelected.id : '';
      },
      (err: string) => console.error('Observer got an error: ' + err),
      () => {
        console.log('Observer got a complete notification');
      }
    );

    this.userService.getUsersFromDB();
  }

  getCategoriesFromService(){

    console.log('getCategoriesFromService ItemCategoryFormComponent');

    this.categorySubscription = this.categoryService.categoriesSubject
    .subscribe(
      (data:Category[]) => {
        console.warn(data);
        this.categoryValues = data;
        this.categorySelected = this.categoryValues[0];
        this.categorySelectedId =  this.categoryValues.length ? this.categoryValues[0].id : '';

        this.subCategorySelected = this.categorySelected.subCategories.length ? this.categorySelected.subCategories[0] : null;
        this.subCategorySelectedId = this.subCategorySelected ? this.subCategorySelected.id : '';

      },
      (err: string) => console.error('Observer got an error: ' + err),
      () => {
        console.log('Observer got a complete notification');
      }
    );

    this.categoryService.getCategoriesFromDB();
  }

  onSelectCategoryById(event:string) {
    if(event) {
      this.categorySelected = this.categoryValues.find(cat=>cat.id===event);
      this.subCategoryValues = this.categorySelected ? this.categorySelected.subCategories : [];

      this.subCategorySelectedId = this.subCategoryValues.length ? this.subCategoryValues[0].id : '';

      console.warn('onSelectCategoryById', this.categorySelected.name);
    }
  }

  onSelectSubCategoryById(event:string) {
    console.warn('onSelectSubCategoryById', event);
    if(event) {
      this.subCategorySelected = this.subCategoryValues.find(subCat=>subCat.id===event);
      this.subCategorySelectedId = this.subCategorySelected ? this.subCategorySelected.id : '';
    }
  }

  onSelectCategoryForSubById(event:string) {
    console.warn('onSelectCategoryForSubById', event);
    if(event) this.categorySelectedForSub = this.categoryValues.find(cat=>cat.id===event);;
  }

  onSelectUser(event:User) {
    console.warn('selectInstructor', event.lastname);
    if(event) this.userSelected = event;
  }

  displayPanel(activeTab){
    this.activeTab = activeTab;
  }

  onCreateCategory() {

    console.log('onCreateCategory');

    const categoryName = this.categoryForm.get('categoryName').value;

    this.categoryService.addCategoryToDB(new Category(null, categoryName, []))
                        .then((cat) => {
                            if(cat) {
                              // clear input
                              this.categoryForm.patchValue({categoryName:''});

                              // display form values on success
                              alert('SUCCESS!! :-)\n\n' + JSON.stringify(cat, null, 4));
                              this.categoryForm.reset();
                            }
                            else {
                              alert('FAILED!! :-(\n\n');
                            }
                          }
                        );

  }

  onCreateSubCategory() {

    console.log('onCreateSubCategory');

    const categoryForSub = this.categorySelectedForSub;
    console.warn('categorySelectedForSub', this.categorySelectedForSub);
    const subcategoryName = this.subcategoryForm.get('subcategoryName').value;

    this.categoryService.addSubCategoryToDB(categoryForSub ,new Category(null, subcategoryName, []))
                        .then((cat) => {
        if(cat) {
          // clear input
          this.subcategoryForm.patchValue({subcategoryName:''});

          // display form values on success
          alert('SUCCESS!! :-)\n\n' + JSON.stringify(cat, null, 4));
          this.subcategoryForm.reset();
        }
        else {
          alert('FAILED!! :-(\n\n');
        }
      }
    );
  }

  onCreateCourse() {

    console.log('onCreateCourse');

    const courseTitle = this.courseForm.get('courseTitle').value;
    const courseCatchPhrase = this.courseForm.get('courseCatchPhrase').value;
    const courseCategory = this.categorySelected;
    const courseSubCategory = this.subCategorySelected;
    console.warn('categorySelected', this.categorySelected);
    const courseDescription = this.courseForm.get('courseDescription').value;
    const coursePrice = this.courseForm.get('coursePrice').value;
    const courseInstructors = [this.userSelected.getIUser(), this.authService.authUser.getIUser()];
    const courseSrcLink = this.courseForm.get('courseSrcLink').value;
    const courseSkills =  [];
    const coursePrerequisite =  [];
    const creationDate = this.datePipe.transform(Date.now().toString(), 'dd/MM/yyyy');
    const tags = [];

    if(this.imageService.imageToUpload) {
      const fileRef = firebase.storage().ref('images').child('courses');

      this.imageService.uploadFile(this.imageService.imageToUpload, fileRef).then(
        (url:string) => {
  
          if(url && url !==''){
            // faire condition pour identification Image
            console.log('Image Link :', url);

            this.createCourse(new Course(null,
                                         'course',
                                         courseTitle,
                                         new Category(courseCategory.id, courseCategory.name, [courseSubCategory]),
                                         tags,
                                         courseCatchPhrase,
                                         courseDescription,
                                         coursePrice,
                                         courseInstructors,
                                         creationDate,
                                         true,
                                         [],
                                         null,
                                         true,
                                         null,
                                         courseSkills,
                                         coursePrerequisite,
                                         [],
                                         0,
                                         url,
                                         '',
                                         ''));
         
          }
          else 
          {
            this.createCourse(new Course(null,
              'course',
              courseTitle,
              new Category(courseCategory.id, courseCategory.name, [courseSubCategory]),
              tags,
              courseCatchPhrase,
              courseDescription,
              coursePrice,
              courseInstructors,
              creationDate,
              true,
              [],
              null,
              true,
              null,
              courseSkills,
              coursePrerequisite,
              [],
              0,
              Database.DEFAULT_IMG_COURSE,
              '',
              ''));
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else {
      
      this.createCourse(new Course(null,
                                  'course',
                                  courseTitle,
                                  new Category(courseCategory.id, courseCategory.name, [courseSubCategory]),
                                  tags,
                                  courseCatchPhrase,
                                  courseDescription,
                                  coursePrice,
                                  courseInstructors,
                                  creationDate,
                                  true,
                                  [],
                                  null,
                                  true,
                                  null,
                                  courseSkills,
                                  coursePrerequisite,
                                  [],
                                  0,
                                  Database.DEFAULT_IMG_COURSE,
                                  '',
                                  '')
                                );
    }
  }

  private createCourse(newCourse:Course) {
    this.itemService.addNewCourseInDBByAdmin(newCourse).then(
      (course) => {
        if(course) {
          // display form values on success
          alert('SUCCESS!! :-)\n\n' + JSON.stringify(course, null, 4));
          this.courseForm.reset();
        } else {
          alert('FAILED!! :-(\n\n');
        }
      }
    );
  }


  onCreateUser() {

    console.error('onCreateInstructor', this.categorySelectComponent.idCategorySelected);

    const userFirstname = this.userForm.get('userFirstname').value;
    const userLastname = this.userForm.get('userLastname').value;
    const userTitle = this.userForm.get('userTitle').value;
    const userBio = this.userForm.get('userBio').value;

    this.userService.addNewUserToDB(new User(null, 
                                             userFirstname,
                                             userLastname,
                                             null,
                                             null,
                                             null,
                                             null,
                                             userTitle,
                                             userBio,
                                             "Autre",
                                             UserLevel.STANDARD,
                                             true,
                                             [],
                                             [])).then(
                                              (val) => {
                                                if(val) {
                                                  // display form values on success
                                                  alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.userForm.value, null, 4));
                                                  this.userForm.reset();
                                                }
                                                else {
                                                  alert('FAILED!! :-(\n\n' + JSON.stringify(this.userForm.value, null, 4));
                                                }
                                              }
                                            );

  }

  onPreviewImage(event) {

    if (event.target.files && event.target.files[0]) {
      this.imageService.getImagePreview(event.target.files[0]);
    }
    else{
      this.urlImagePreview = null;
    }
  }

  getSelectType() {
    return SelectType;
  }

  ngOnDestroy(){

    if (this.imagePreviewSubscription != null) {
      this.imagePreviewSubscription.unsubscribe();
    }

    if (this.categorySubscription != null) {
      this.categorySubscription.unsubscribe();
    }

    if (this.userSubscription != null) {
      this.userSubscription.unsubscribe();
    }
  }
}
