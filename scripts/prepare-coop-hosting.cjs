'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),hosting=path.join(root,'hosting');
fs.mkdirSync(path.join(hosting,'runtime'),{recursive:true});
const modules=['names','sim','song-quality','cards','music','decisions','house','morale','casting','bandlive'];
let runtime=modules.map(n=>fs.readFileSync(path.join(root,'dist',n+'.js'),'utf8')).join('\n');
// Remove only Node fallback imports/exports; the ordered browser globals remain unchanged.
runtime=runtime.replace(/\(typeof require==='function'\?require\('[^']+'\):null\)/g,'null').replace(/if\(typeof module!=='undefined'\)module\.exports=root\.\w+;/g,'');
const core=fs.readFileSync(path.join(root,'server/coop-core.cjs'),'utf8').replace('module.exports={create,join,command,view,prepared};','return {create,join,command,view,prepared};');
runtime+='\nconst core=(()=>{\n'+core+'\n})();\nexport default core;\n';
fs.writeFileSync(path.join(hosting,'runtime/engine.mjs'),runtime);
const api=fs.readFileSync(path.join(root,'server/coop-api.cjs'),'utf8').replace('module.exports={handler,d1Store};','export {handler,d1Store};');fs.writeFileSync(path.join(hosting,'runtime/api.mjs'),api);
const publicDir=path.join(hosting,'public');fs.mkdirSync(publicDir,{recursive:true});
for(const name of fs.readdirSync(path.join(root,'dist')))if(!['server','client','.openai'].includes(name))fs.cpSync(path.join(root,'dist',name),path.join(publicDir,name),{recursive:true});
const manifest={...JSON.parse(fs.readFileSync(path.join(root,'.openai/hosting.json'))),d1:'DB',r2:null};delete manifest.static;
fs.writeFileSync(path.join(hosting,'.openai/hosting.json'),JSON.stringify(manifest,null,2)+'\n');
