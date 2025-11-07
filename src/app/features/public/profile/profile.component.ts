import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDividerModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  readonly profileImage = 'assets/cam-profile.jpeg';

  readonly skills = [
    { category: 'Frontend', items: ['Angular 18', 'TypeScript', 'RxJS', 'Material Design', 'Responsive Design'] },
    { category: 'Backend', items: ['.NET Core', 'C#', 'SQL Server', 'REST APIs', 'Entity Framework'] },
    { category: 'Tools', items: ['Git', 'Azure DevOps', 'Docker', 'VS Code', 'Azure Cloud'] },
  ];

  readonly experience = [
    {
      role: 'Angular Front-End Engineer',
      company: 'Current Role',
      duration: '2+ years',
      description: 'Building scalable Angular applications with Material Design',
    },
    {
      role: '.NET Integration Specialist',
      company: 'Previous Experience',
      duration: '3+ years',
      description: 'Enterprise integration and REST API development',
    },
  ];
}
