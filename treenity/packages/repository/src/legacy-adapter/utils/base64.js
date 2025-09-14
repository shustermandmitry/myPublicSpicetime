export function btoa(str) {
  return new Buffer(str, 'base64').toString('ascii');
}

export function atob(str) {
  return new Buffer(str, 'ascii').toString('base64');
}
