import { Component } from '@angular/core';

interface TeamMember {
  name: string;
  role: string;
  github: string;
  avatar: string;
}

@Component({
  selector: 'ec-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly team: TeamMember[] = [
    {
      name: 'Kiryl Tserpilouski',
      role: 'Full Stack Developer',
      github: 'https://github.com/Tserpilouski',
      avatar: 'kiryl.jpeg',
    },
    {
      name: 'Dominik Obuch',
      role: 'Full Stack Developer',
      github: 'https://github.com',
      avatar: 'https://placehold.co/120x120',
    },
    {
      name: 'Vladyslav Sklema',
      role: 'Developer',
      github: 'https://github.com',
      avatar: 'https://placehold.co/120x120',
    },
  ];
}
