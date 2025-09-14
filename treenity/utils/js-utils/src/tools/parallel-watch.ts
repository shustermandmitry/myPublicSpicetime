#!/usr/bin/env tsx

import { exec } from 'child_process';
import chokidar from 'chokidar';
import fs from 'fs';
import { minimatch } from 'minimatch';
import path from 'path';

interface ParallelWatchConfig {
  include: string[];
  command: string;
  directories: string[];
  runAhead: boolean;
}

export const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

function loadConfig(): ParallelWatchConfig {
  const configPath = path.join(process.cwd(), 'parallel-watch.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('parallel-watch.json not found');
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

function getFileAndDirectiry(config: ParallelWatchConfig, path: string): [string, string] {
  const dir = config.directories.find(dir => path.startsWith(dir))!;
  if (path === dir) [dir, ''];

  let file = path.slice(dir.length + 1);
  try {
    if (fs.statSync(path).isDirectory()) file += '/';
  } catch (err: any) {
    console.warn('STAT:', err.message);
  }

  return [dir, file];
}

function runCommand(config: ParallelWatchConfig, dir: string): Promise<void> {
  console.log(`Running command in ${dir}: ${config.command}`);

  const name = path.basename(dir);

  return new Promise((resolve, reject) => {
    const child = exec(config.command, { cwd: dir });

    child.stdout?.on('data', (data) => {
      process.stdout.write(`${name}: ${data}`);
    });

    child.stderr?.on('data', (data) => {
      process.stdout.write(`e ${name}: ${data}`);
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

function watchDirectories(config: ParallelWatchConfig) {
  console.log('Watching directories:');
  console.log(config.directories.join('\n'));

  const watcher = chokidar.watch(config.directories, {
    ignored: (path: string) => {
      const [dir, file] = getFileAndDirectiry(config, path);
      if (file === '/') return false;

      const inc = config.include.some(pattern => minimatch(file, pattern, { matchBase: true }));
      return !inc;
    },
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 100,
    },
    usePolling: process.platform === 'win32', // Use polling on Windows
  });

  const debounces: Record<string, Promise<void> | undefined> = {};
  const needRestart: Record<string, boolean> = {};

  // wait till previous command execution is finished
  const run = (dir: string) => {
    if (debounces[dir]) {
      needRestart[dir] = true;
      // console.info('still building, will restart after build is finished');
    }
    return (
      // wait, maybe some files are still being written
      (debounces[dir] ||= wait(100).then(() => runCommand(config, dir)
          .catch(err => {
            console.error('error while running command:', dir, err?.message);
          })
          .finally(() => {
            delete debounces[dir];
            if (needRestart[dir]) {
              needRestart[dir] = false;
              return run(dir);
            }
          }))
      ));
  };

  if (config.runAhead) {
    config.directories.forEach(run);
  }

  watcher.on('all', (event, filePath) => {
    console.log(`File ${filePath} has been ${event}d`);

    const [dir, file] = getFileAndDirectiry(config, filePath);


    run(dir);
  });

  watcher.on('error', error => {
    console.error(`Watcher error: ${error}`);
  });

  return watcher;
}

async function main(): Promise<any> {
  try {
    const config = loadConfig();
    const watcher = watchDirectories(config);
    console.log('Parallel Watch started. Watching for file changes...');

    process.on('SIGINT', () => {
      console.log('Closing watcher...');
      watcher.close();
      process.exit(0);
    });
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
