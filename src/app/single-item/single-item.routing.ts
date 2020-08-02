import { Routes, RouterModule } from '@angular/router';
import { SingleCourseComponent } from './pages/single-course/single-course.component';
import { SingleEventComponent } from './pages/single-event/single-event.component';
import { SingleUserComponent } from './pages/single-user/single-user.component';

const routes: Routes = [
  {path:'course/:id', component:SingleCourseComponent},
  {path:'event/:id', component:SingleEventComponent},
  {path:'user/:id', component:SingleUserComponent}
];

export const SingleItemRoutes = RouterModule.forChild(routes);
