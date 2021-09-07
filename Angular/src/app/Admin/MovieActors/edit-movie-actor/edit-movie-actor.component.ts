import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'src/app/models/Actor';
import { Movie } from 'src/app/models/Movie';
import { MovieActor } from 'src/app/models/MovieActor';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-edit-movie-actor',
  templateUrl: './edit-movie-actor.component.html',
  styleUrls: ['./edit-movie-actor.component.css']
})
export class EditMovieActorComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private adminSevice: AdminService,
    private router: Router,
    private activateRoute: ActivatedRoute
    ) { }

  title!: string;
  btnTitle!: string;
  maForm!: FormGroup;
  movieActor!: MovieActor;
  movies: Movie[] = [];
  actors: Actor[] = [];
  message: string = '';
  id: number = 0;

  messageValidate = {
    actorId: {
      requierd: 'The Show Actor is required',
    },
    movieId: {
      required: 'The Name is required',
    },
  };


  ngOnInit(): void {
    this.title = 'Add Actor to Show';
    this.btnTitle = 'Add';
    this.maForm = this.fb.group({
      actorId: [0, Validators.required],
      movieId: [0, Validators.required],
    })

    this.movieActor = {
      id: 0,
      actor: null as any,
      actorId: 0,
      movieId: 0,
      movie: null as any
    }

    this.GetMovies();
    this.GetActors();

    this.activateRoute.paramMap.subscribe(param => {
      var actId = Number(param.get('id'));
      if (actId) {
        this.adminSevice.GetMovieActor(actId).subscribe(act => {
          this.title = 'Edit Actor';
          this.btnTitle = 'Update and Save';
          this.id = actId;
          this.maForm.patchValue({
            actorId: act?.actorId,
            movieId: act?.movieId
          });
        }, ex => {
          console.log(ex);
        })

      }
    })
  }

  GetActors() {
    this.adminSevice.GetAllActors().subscribe(list => {
      this.actors = list;
    }, ex => console.log(ex));
  }

  GetMovies() {
    this.adminSevice.GetAllMovies().subscribe(list => {
      this.movies = list;
    }, ex => console.log(ex));
  }


  backToList() {
    sessionStorage.setItem('movieactor', 'movieactor');
    this.router.navigate(['/controlpanel']);
  }

  AddOrEditMovieActor() {
    const movId = this.maForm.value.movieId;
    const actId = this.maForm.value.actorId;
    if (this.maForm.invalid || movId < 1 || actId < 1) {
      return;
    }
    this.movieActor.actorId = actId;
    this.movieActor.movieId = movId;
    
    if (this.id > 0) {
      this.movieActor.id = this.id;
      this.adminSevice.EditMovieActor(this.movieActor).subscribe(result => {
        this.backToList();
      }, ex => console.log(ex));
    } else {
      this.adminSevice.AddMovieActor(this.movieActor).subscribe(result => {
        this.message = 'New Actor added successfully';
        this.maForm.reset();
        this.maForm.patchValue({
          actorId: 0,
          movieId: 0
        });
      }, ex => console.log(ex));
    }
  }

}