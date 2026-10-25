'use strict';
require('./prepare-coop-hosting.cjs');
const path=require('node:path'),{spawn}=require('node:child_process');
const child=spawn(process.execPath,['scripts/run-framework.mjs','dev',...process.argv.slice(2)],{cwd:path.resolve(__dirname,'../hosting'),stdio:'inherit'});
child.on('exit',code=>process.exit(code??1));
process.on('SIGINT',()=>child.kill('SIGINT'));
