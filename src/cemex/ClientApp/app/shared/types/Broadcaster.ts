import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

interface BroadcastEvent {
  key: any;
  data?: any;
}

export class Broadcaster {
  public static CHANGE_SCREEN_HOME: 'change_screen';
  public static _eventBus: Subject<BroadcastEvent>= null;

  constructor() {
    if (Broadcaster._eventBus == null || Broadcaster._eventBus == undefined) {
      Broadcaster._eventBus = new Subject<BroadcastEvent>();
    }
  }

  broadcast(key: any, data?: any) {
    Broadcaster._eventBus.next({key, data});
  }

  on<T>(key: any): Observable<T> {
    return Broadcaster._eventBus.asObservable()
      .filter(event => event.key === key)
      .map(event => <T>event.data);
  }
}
