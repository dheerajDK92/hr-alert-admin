// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  dummyOTP: 123456,
  perssionName: "permissionaForHRAlert",
  Appname: "HR Alert Care - Admin",
  hrEmail: "admin@alertltd.com",
  resendOTPTime: 5,
  TOKEN_KEY: "auth-token",
  firstTime: "isFirstTime",
  adminUser: "admin",
  adminPass: "admin",
  activateAdminLoginPopUp: false,
  protocol: "http://",
  // apiURL: "localhost:3000/api/v1",
  // imageApiURL: "localhost:3000",
  apiURL: "185.196.3.147:3000/api/v1",
  imageApiURL: "185.196.3.147:3000",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
