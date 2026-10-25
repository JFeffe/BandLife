'use strict';
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
require('./prepare-coop-hosting.cjs');const root=path.resolve(__dirname,'..'),hosting=path.join(root,'hosting');
const result=spawnSync(process.execPath,['scripts/run-framework.mjs','build'],{cwd:hosting,stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);
for(const name of ['client','server','.openai']){const source=path.join(hosting,'dist',name);if(fs.existsSync(source))fs.cpSync(source,path.join(root,'dist',name),{recursive:true});}
if(fs.existsSync(path.join(hosting,'drizzle')))fs.cpSync(path.join(hosting,'drizzle'),path.join(root,'drizzle'),{recursive:true});
