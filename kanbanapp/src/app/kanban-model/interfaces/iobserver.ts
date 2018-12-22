import { User } from '../classes/user';
import { Group } from '../classes/group';

export interface IObserver {
    update(user: User, group: Array<Group>): void;
}
