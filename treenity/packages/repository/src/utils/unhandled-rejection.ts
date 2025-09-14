let unhandledRejectionSetup = false;

export function setupUnhandledRejection(logger = console.error): void {
  if (unhandledRejectionSetup) return;
  unhandledRejectionSetup = true;

  process.on('unhandledRejection', (reason: any) => {
    const errs = reason?.name === 'AggregateError' ? (reason as AggregateError).errors : [reason];

    logger(import.meta.filename, 'Unhandled Rejection', ...errs);
  });
}
