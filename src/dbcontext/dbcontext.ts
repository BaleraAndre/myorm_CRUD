import { PGDBManager, PGDBContext, PGDBSet} from 'myorm_pg';
import { User } from '../model/ent/user';


export default class Context extends PGDBContext
{
    public users : PGDBSet<User>;

    constructor(manager : PGDBManager)
    {
        super(manager);  
        this.users = new PGDBSet(User, this);      
         
    }
}




