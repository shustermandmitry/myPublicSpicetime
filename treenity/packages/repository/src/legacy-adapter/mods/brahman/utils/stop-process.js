export default class StopProcess extends Error {
  constructor(msg = 'stop') {
    super(msg);
  }
}
