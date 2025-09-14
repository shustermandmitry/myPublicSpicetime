#!/usr/bin/env tsx

import { exec } from '../schema/extract-schemas';

exec().then(console.log, console.error);
