import { ChangeDetectionStrategy, Component, Input, AfterViewInit } from '@angular/core';
import { Course } from '../models/course';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCardComponent {
  constructor() {}
  @Input() course?: Course;
  ngAfterViewInit(): void {

  }
}
