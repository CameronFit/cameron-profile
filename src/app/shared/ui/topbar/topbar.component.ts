import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AUTH_STATE } from '../../../core/tokens/auth-state.token';
import { MaterialModule } from '../../material/material';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, MaterialModule ],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  private auth = inject(AUTH_STATE);
  isAuthed = () => this.auth.isAuthenticated();
}
