Patch Libs
=====

Package to put your pathces for extarnal libs. Will be applied automatically only to packages,
which exists in your setup.

**Create new patch for &lt;package>**

1. pnpm i &lt;package>
1. Edit files in `node_modules/<package>`
1. `patch-package <package>`
1. The patch will be created in the `patches` directory
1. Commit the file `patches/<package>+<version>.patch`
1. Revert `package.json`. No need for any deps

**Test your patch before commit**

1. Run `npm run patch-libs`
2. The `<package>` will be installed in `node_modules` and patched
3. Check that all the changes applied correctly
4. Use `npm run cleanup` to remove deps, and run patch process again

Patches are applied automatically with 
