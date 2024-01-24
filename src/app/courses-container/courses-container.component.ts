import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from '../course-card/course-card.component';
import { Course } from '../models/course';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-courses-container',
  standalone: true,
  imports: [CourseCardComponent, CommonModule],
  templateUrl: './courses-container.component.html',
  styleUrl: './courses-container.component.scss',
})
export class CoursesContainerComponent {
  courses$?: Observable<Course[]>;
  courses: Course[] = [];

  constructor(
    private http: HttpClient,
  ) {}


  ngOnInit(): void {
    this.courses$ = this.http.get(
      'http://localhost:9000/api/courses'
    ) as Observable<Course[]>;
  }

}
