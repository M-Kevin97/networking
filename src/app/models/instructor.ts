import { User } from './user';
import { Course } from './course';
import { EventItem } from './event-item';

export class Instructor extends User {

    constructor(id: string,
                firstname: string, 
                lastname: string, 
                mail: string, 
                password: string, 
                tel?: string, 
                job?: string,
                description?: string,
                courses?: Course[],
                events?: EventItem[]){
                    
        super(id,
              firstname,
              lastname,
              mail,
              password,
              tel,
              job,
              description,
              courses,
              events);
    }
}
