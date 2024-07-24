/**
 * Command Line Argument Map
 * @returns {Map<string, string>}
 */
function parseCommandLineArgs() {
  return process.argv.slice(2).reduce((argvMap, arg) => {
    if (/--\w+/g.test(arg)) {
      const splittedArg = arg.replace('--', '').split('=');
      argvMap.set(splittedArg[0], splittedArg[1] || '');
    }
    return argvMap;
  }, new Map());
}

globalThis.CL_ARGS = parseCommandLineArgs();
