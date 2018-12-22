import { User } from '../classes/user';

export interface IObserver {
    update(user: User, email: string): void;
}
