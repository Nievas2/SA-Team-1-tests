import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseCategory } from 'src/app/core/interfaces/courseCategory';
import { CourseCategoryService } from 'src/app/core/services/course-category.service';
import { LoginService } from 'src/app/core/services/login.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css'],
})
export class EditCategoryComponent implements OnInit {
  form: FormGroup;
  id: number;
  categories: CourseCategory = {
    id: 0,
    name: '',
  };
  admin: boolean = false;
  constructor(
    private fb: FormBuilder,
    private courseCategoryService: CourseCategoryService,
    private router: Router,
    private aRouter: ActivatedRoute,
    private loginSvc: LoginService,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
    this.getById(this.id);
    this.getCategories();
  }

  ngOnInit(): void {
    this.loginSvc.isAdmin.subscribe(
      (isAdmin)=>{
        this.admin = isAdmin
        if(this.admin === false){
          
          this.router.navigateByUrl('');
        }
      }
    )
    }
  getById(id: number) {
    this.courseCategoryService.getCourseCategoryById(id).subscribe((data) => {
      this.form.setValue({
        name: data.name,
      });
    });
  }
  getCategories() {
    this.courseCategoryService.getCourseCategory().subscribe(
      (res) => {
        this.categories = <any>res;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  update() {
    this.categories = {
      id: this.id,
      name: this.form.value.name,
    };
      this.courseCategoryService.putCourseCategory(this.categories, this.id)
      .subscribe(
        (data) => {
          this.router.navigate(['/admin/panel/categories']);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
