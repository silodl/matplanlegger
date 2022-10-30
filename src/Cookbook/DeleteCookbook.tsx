import {db} from '../Firebase';
import {doc, deleteDoc} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { CookbookProps } from './UseCookbooks';

export const DeleteCookbook = async (props: {cookbook: CookbookProps, user: User}) => {
    if(props.user && props.user.email && props.cookbook){
        if (props.cookbook.owners.includes(props.user.email)) {
            await deleteDoc(doc(db, "cookbooks", props.cookbook.id));
        }
    }      
}