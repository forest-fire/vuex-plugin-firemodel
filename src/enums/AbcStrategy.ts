export enum AbcStrategy {
  loadVuex = 'loadVuex',
  /**
   * Forces **get** based queries to always go to firebase (however promise is returned after
   * local query); this does not affect _discrete_ gets or unknown load queries.
   */
  getFirebase = 'getFirebase',
}
