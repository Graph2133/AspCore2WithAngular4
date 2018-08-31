import { Observable } from 'rxjs/Observable';


export abstract class BaseService {

  constructor() { }

  protected handleError(error: any) {
    console.log(error);
    if (error.headers) {
      var applicationError = error.headers.get('Application-Error');
    }

    // either applicationError in header or model error in body
    if (applicationError) {
      console.log(1);
      return Observable.throw(applicationError);
    }

    var modelStateErrors: string = '';
    var serverError = error.json();

    if (!serverError.type) {
      for (var key in serverError) {
        if (serverError[key])
          modelStateErrors += serverError[key] + "<br/>";
      }
    }

    modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;
    return Observable.throw(modelStateErrors || 'Server error');
  }
}