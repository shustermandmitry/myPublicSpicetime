#!/usr/bin/env tsx

import { mapKeys } from '@s-libs/micro-dash';
import c from 'chalk';
/** update package.json exports for libraries after build **/
import glob from 'fast-glob';
import fs from 'fs/promises';
import path from 'node:path';
import semver from 'semver';
import YAML from 'yaml';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import { jsonStringifyCompact } from '../utils/json-stringify-compact';

const findFileUp = async (name: string) => {
  let dir = process.cwd();
  while (dir.length > 1) {
    let tryPath = path.join(dir, name);
    if (await fs.stat(tryPath).catch(() => false)) return tryPath;
    // go dir up
    dir = path.join(dir, '..');
  }
  throw new Error(`file not found: ${name}`);
};

async function getLatestNpmVersion(packageName: string) {
  const response = await fetch(`https://registry.npmjs.org/${packageName}`);
  const data = (await response.json()) as any;
  return data['dist-tags'].latest;
}

async function collectLatestNpmVersions(forUpdate: string[]): Promise<any> {
  return Object.fromEntries(
    await Promise.all(
      forUpdate.map(async packageName => [packageName, await getLatestNpmVersion(packageName)]),
    ),
  );
}

type Deps = { [name: string]: string };

interface PackageJson {
  name: string;
  version: string;
  dependencies: Deps;
  devDependencies: Deps;
  peerDependencies?: Deps;
}

type PackageJsons = { [name: string]: PackageJson };

const checkVersions = (pkgName: string, deps: Deps, packages: PackageJsons) => {
  let changed = false;
  for (let dep in deps) {
    const depVer = deps[dep];
    if (!packages[dep]) continue;

    const pkgVer = `${packages[dep].version}`;
    if (pkgVer !== depVer) {
      console.warn(pkgName, ': version of', dep, ':', depVer, '!==', pkgVer);
      deps[dep] = pkgVer;
      changed = true;
    }
  }
  return changed;
};

const argv = await yargs(hideBin(process.argv))
  .usage(
    `Check all package directories listed in pnpm-workspace.yaml, to verify ${c.red(
      'package.json',
    )} for
${c.cyan(`* all versions are correct
* every script have 'build' and 'clean' scripts
* can fix versions and add 'clean' script
`)}
`,
  )
  .alias('h', 'help')
  .help('h')
  .alias('f', ['fix', 'fix-latest'])
  .describe(
    'f',
    `Fix versions and ${c.green('`clean`')} script in ${c.red('package.json')} automatically`,
  )
  .alias('c', 'fix-common')
  .describe('c', 'Fix versions of NPM packages to most common version in the project')
  .describe(
    'npm',
    'Check versions of all npm packages across workspace to show differences, use --fix to update all versions to the greatest version found across packages',
  )
  .alias('u', 'update')
  .describe(
    'u',
    'update internal packages to the latest versions. Helpful if you using NPM versions instead of monorepo',
  )
  .describe('dir', 'Start from this dir').argv;

// yargsFactory.command('docs', 'Show docs and examples', { url: { alias: 'i' } });

const sortObjectByKey = (dep: Deps) => {
  return Object.fromEntries(
    Object.keys(dep)
      .sort()
      .map(key => [key, dep[key]]),
  );
};

async function parsePackageJson(pkgPath: string) {
  const pkg = JSON.parse((await fs.readFile(pkgPath)).toString());
  return pkg;
}

function collectPackageVersions(
  packageVersions: any,
  pkg: any,
  localPackages: string[],
  ...depps: Deps[]
) {
  // flatten all deps
  const deps = Object.assign({}, ...depps);
  for (let dep in deps) {
    // collect only external NPM-located packages
    if (localPackages.includes(dep)) continue;

    const version = deps[dep];
    if (!packageVersions[dep]) packageVersions[dep] = {};
    if (!packageVersions[dep][version]) packageVersions[dep][version] = [];
    packageVersions[dep][version].push(pkg.name);
  }
}

async function fixNpmVersions(
  checkPackages: { [p: string]: any },
  packages: {
    [p: string]: any;
  },
  pkgPaths: { [p: string]: string },
): Promise<void> {
  const packageVersions: Record<string, Record<string, string[]>> = {};

  const localPackages = Object.keys(checkPackages);
  // check all package versions, and show differencies
  for (let pkgName in checkPackages) {
    const pkg = packages[pkgName];
    collectPackageVersions(
      packageVersions,
      pkg,
      localPackages,
      pkg.dependencies,
      pkg.devDependencies,
      pkg.peerDependencies,
    );
  }

  const multipleVersions = Object.keys(packageVersions)
    .map(pkgName => ({
      name: pkgName,
      update: argv.update && pkgName.startsWith('@treenity'),
      versions: packageVersions[pkgName],
      versionsFixed: mapKeys(packageVersions[pkgName], (_, ver) => ver),
      versionsClean: mapKeys(packageVersions[pkgName], (_, ver) => ver.replace(/[~^]/g, '')),
      len: Object.keys(packageVersions[pkgName]).length,
    }))
    .filter(p => p.len > 1 || p.update);

  // no changes found
  if (!multipleVersions.length) {
    console.log(c.green('No wrong versions found'));
    return;
  }

  console.log(c.red('Differences in package versions'));
  for (let ver of multipleVersions) {
    console.log(
      c.blue(ver.name),
      Object.entries(ver.versions)
        .map(([k, v]) => `${k} (${v.length})`)
        .join(', '),
      ver.update ? c.yellow('check update') : '',
    );
  }

  const shouldFix = argv.fix || argv['fix-common'];
  if (!shouldFix) return;

  console.log(c.red('Fixing to:'));

  // collect updated versions
  const latestNpmVersions = await collectLatestNpmVersions(
    multipleVersions.filter(p => p.update).map(p => p.name),
  );

  const changedPackages = new Set<string>();
  for (let ver of multipleVersions) {
    let foundVersion;
    if (ver.update) {
      // try to find latest version
      foundVersion = latestNpmVersions[ver.name];
      if (ver.versionsClean[foundVersion] && Object.keys(ver.versionsClean).length === 1) {
        // already have this version
        continue;
      }
      console.log('New version', ver.name, foundVersion);
    } else if (ver.len < 2) {
      // only one version of @treenity/* and no need to update
      continue;
    } else if (argv['fix-common']) {
      // fix to most common version
      foundVersion = Object.entries(ver.versionsClean).sort(
        ([ak, av], [bk, bv]) => bv.length - av.length || semver.compare(bk, ak),
      )[0][0];
    } else {
      // fix to latest version
      foundVersion = semver.rsort(Object.keys(ver.versionsClean), true)[0];
    }

    console.log(`${c.blue(ver.name)} -> ^${foundVersion}`);

    Object.entries(ver.versions as Record<string, string[]>).forEach(([version, pkgs]) => {
      (pkgs as string[]).forEach(pkgName => {
        const pkg = packages[pkgName];

        const deps = pkg.dependencies?.[ver.name]
          ? pkg.dependencies
          : pkg.devDependencies?.[ver.name]
            ? pkg.devDependencies
            : pkg.peerDependencies?.[ver.name]
              ? pkg.peerDependencies
              : undefined;

        if (deps) {
          deps[ver.name] = '^' + foundVersion;
          changedPackages.add(pkgName);
        }
      });
    });
  }

  for (const pkgName of changedPackages) {
    await fs.writeFile(pkgPaths[pkgName], jsonStringifyCompact(packages[pkgName]) + '\n');
  }
}

async function fixMonorepoPackageVersions(
  checkPackages: { [p: string]: any },
  packages: { [p: string]: any },
  pkgPaths: {
    [p: string]: string;
  },
): Promise<void> {
  const shouldFix = argv.fix;

  for (let pkgName in checkPackages) {
    const pkg = packages[pkgName];

    let changed = checkVersions(pkg.name, pkg.dependencies, packages);
    let changedDev = checkVersions(pkg.name, pkg.devDependencies, packages);
    const changedPeer =
      pkg.peerDependencies && checkVersions(pkg.name, pkg.peerDependencies, packages);

    // check and move dev-time packages from dependencies to devDependencies
    for (let dep in pkg.dependencies) {
      if (
        pkg.name !== '@treenity/build-utils' &&
        [
          'rollup',
          '@rollup',
          'vite',
          'babel',
          '@babel',
          '@types',
          '@treenity/tsconfig',
          '@treenity/build-utils',
        ].some(prefix => dep.startsWith(prefix))
      ) {
        if (shouldFix) {
          console.warn(pkgName, ': moving', dep, 'to devDependencies');
        } else {
          console.warn(pkgName, ':', dep, 'in dependencies');
        }

        if (!pkg.devDependencies) pkg.devDependencies = {};
        pkg.devDependencies[dep] = pkg.dependencies[dep];
        delete pkg.dependencies[dep];
        changed = changedDev = true;
      }
    }

    if (changedDev) {
      pkg.devDependencies = sortObjectByKey(pkg.devDependencies);
    }

    if (pkg.scripts && !pkg.scripts.clean) {
      console.warn('`clean` script not found in', pkgName);
      if (shouldFix) pkg.scripts.clean = 'treenity-clean';
    }
    if (pkg.scripts && !pkg.scripts.build) {
      console.warn('`build` script not found in', pkgName);
    }

    if (shouldFix) {
      if (changed || changedDev || changedPeer) {
        await fs.writeFile(pkgPaths[pkgName], jsonStringifyCompact(pkg) + '\n');
      }
    }
  }
}

async function main() {
  if (argv.dir) {
    process.chdir(argv.dir as string);
  }

  const pnpmWorkspaceFile = await findFileUp('pnpm-workspace.yaml');
  const pnpmWorkspace = YAML.parse((await fs.readFile(pnpmWorkspaceFile)).toString());
  const packageGlob = pnpmWorkspace.packages.map((d: string) => d + '/package.json');
  packageGlob.push('./package.json');
  const rootDir = path.dirname(pnpmWorkspaceFile);
  const packageJsons = await glob(packageGlob, { cwd: rootDir });

  const packages: { [name: string]: any } = {};
  const pkgPaths: { [name: string]: string } = {};

  // collect all packages info
  for (let packageJson of packageJsons) {
    const pkgPath = path.join(rootDir, packageJson);
    const pkg = await parsePackageJson(pkgPath);
    packages[pkg.name] = pkg;
    pkgPaths[pkg.name] = pkgPath;
  }

  const curPkg = await parsePackageJson('./package.json');
  // if we not in root project folder - just check local package.json
  const checkPackages =
    rootDir === process.cwd() || process.env.ROOT ? packages : { [curPkg.name]: curPkg };

  if (argv.npm) {
    await fixNpmVersions(checkPackages, packages, pkgPaths);
  } else {
    await fixMonorepoPackageVersions(checkPackages, packages, pkgPaths);
  }

  return '';
}

main().catch(console.error);
