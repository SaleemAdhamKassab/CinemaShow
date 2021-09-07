import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/CategoryModel';
import { SubCategory } from 'src/app/models/SubCatgory';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})
export class SubCategoryComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private service: AdminService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) { }

  title!: string;
  btnTitle!: string;
  subCatForm!: FormGroup;
  subCategory!: SubCategory;
  categories!: Category[];
  message!: string;
  id!: number;

  messageValidate = {
    subCatName: {
      required: 'Sub Category Name is required',
      max: 'The maximum number of characters is 200',
    },
    catId: {
      required: 'The Main Category is required',
    },
  };

  ngOnInit(): void {
    this.title = 'Add Sub Category';
    this.btnTitle = 'Add ';
    this.subCategory = {
      id: 0,
      subCategoryName: '',
      categoryId: 0,
      category: {
        id:0,
        categoryName:''
      }
    };
    this.id = 0;
    this.categories = [];

    this.subCatForm = this.fb.group({
      subCatName: ['', [Validators.required, Validators.maxLength(200)]],
      catId: [0, [Validators.required]]
    })

    this.getCategories();

    this.activateRoute.paramMap.subscribe(param => {
      var subId = Number(param.get('id'));
      var subName = param.get('id1');
      var catId = param.get('id2');

      if (subId && subName && catId) {
        this.title = 'Edit Sub Category';
        this.btnTitle = 'Update and Save';
        this.id = subId;
        this.subCatForm.patchValue({
          subCatName: subName,
          catId: catId
        });
      }
    })
  }

  getCategories() {
    this.service.GetAllCategories().subscribe(list => {
      this.categories = list;
    }, ex => console.log(ex));
  }

  AddSubCategory() {
    var name = this.subCatForm.value.subCatName;
    var catId = this.subCatForm.value.catId;

    if (name && catId > 0) {
      if (this.id > 0) {
        this.subCategory.id = this.id;
        this.subCategory.categoryId = catId;
        this.subCategory.subCategoryName = name;
        this.subCategory.category.id=catId;
        this.subCategory.category.categoryName='Hello';
        this.service.EditSubCategory(this.subCategory).subscribe(cat => {
          this.GoToList();
        }, ex => {
          this.message = '';
          console.log(ex);
        })
      } else {
        this.subCategory.id = 0;
        this.subCategory.subCategoryName = name;
        this.subCategory.categoryId = catId;
        this.subCategory.category.id=catId;
        this.subCategory.category.categoryName='Hello';
        this.service.AddSubCategory(this.subCategory).subscribe(cat => {
          this.message = 'Sub Category has been added successfully';
          this.subCatForm.reset();
        }, ex => {
          this.message = '';
          console.log(ex);
        })
      }
    }
  }

  GoToList() {
    sessionStorage.setItem('subcat', 'subcat');
    this.router.navigate(['/controlpanel']);
  }
}