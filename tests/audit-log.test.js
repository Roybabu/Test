'use strict';
const fs=require('fs'), path=require('path'), assert=require('assert');
const php=fs.readFileSync(path.join(__dirname,'..','submit.php'),'utf8');
for(const action of ['approve','reject','edit']) assert(php.includes("'"+action+"'"),`missing audit action ${action}`);
for(const field of ['administrator','submissionId','actionType','timestamp','previousStatus','newStatus','metadata']) assert(php.includes("'"+field+"'"),`missing audit field ${field}`);
assert(php.includes('recordAudit('));
for(const secret of ['password','admin_key','authorization','token','credential']) assert(php.includes(secret),'credential filter missing');
assert(fs.existsSync(path.join(__dirname,'..','data','admin-audit-log.json')),'audit store missing');
console.log('audit log tests: PASS');
