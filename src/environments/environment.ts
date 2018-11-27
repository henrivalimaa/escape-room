// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const environment = {
  production: false,
	// Put your Firebase keys below this comment
	firebase: {
	    apiKey: "AIzaSyAD8JehhUyNgKyIHpv-OTTs89mLcnyn704",
	    authDomain: "personal-website-tbh.firebaseapp.com",
	    databaseURL: "https://personal-website-tbh.firebaseio.com",
	    projectId: "personal-website-tbh",
	    storageBucket: "personal-website-tbh.appspot.com",
	    messagingSenderId: "103070895103"
	}
}
