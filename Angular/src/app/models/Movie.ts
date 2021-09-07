import { SubCategory } from './SubCatgory';

export class Movie {
    id!: number;
    movieName!: string;
    movieStory!: string;
    movieTrailer!: any;
    moviePost!: string;
    subCategory!: SubCategory;
}