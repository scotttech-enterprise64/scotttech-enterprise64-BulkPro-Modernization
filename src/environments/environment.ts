// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: "http://bulkpro-dev.enterprise64.net:8041/api", // DEV
  // apiUrl: "http://40.77.0.219:8042/api", // QA
  // apiUrl: "http://localhost:55380/api", // Local
  getDeviceInfo: "/device/DeviceAPI",
  login: "/login/LoginAPI",
  count: "/count/CountAPI"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
