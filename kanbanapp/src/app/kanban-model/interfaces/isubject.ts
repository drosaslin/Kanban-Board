import { IObserver } from './iobserver';
import { User } from '../classes/user';

export interface ISubject {
    registerObserver(observer: IObserver): void;
    removeObserver(observer: IObserver): void;
    notifyObservers(): void;
}
