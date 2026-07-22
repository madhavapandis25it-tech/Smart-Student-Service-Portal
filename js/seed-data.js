'use strict';
(function(){
if(localStorage.getItem('seedInitializedV2'))return;
var oldSeed = localStorage.getItem('seedInitialized');
if (oldSeed) {
    localStorage.removeItem('seedInitialized');
    localStorage.removeItem('certificateApps');
}
var PREFIX_MAP = {
    'Original':'OCR', 'Bonafide':'BCR', 'CGPA/Percentage':'CPR',
    'Community':'CCR', 'Income':'ICR', 'Conduct':'CDR',
    'Nativity':'NCR', 'Migration':'MCR', 'Transfer':'TCR',
    'Education Loan':'ELR', 'Other':'ACR'
};
var prefixCounters = {};
function nextId(type) {
    var p = PREFIX_MAP[type] || 'ACR';
    if (!prefixCounters[p]) prefixCounters[p] = 0;
    prefixCounters[p]++;
    return p + '-2026-' + String(prefixCounters[p]).padStart(6,'0');
}
var now=new Date();var d=function(n){return new Date(now-n*86400000).toISOString();};
var students=[
  {name:'Kaviya S',regNo:'21CSE045',dept:'CSE',year:'III',email:'kaviya@psna.ac.in',phone:'+91 98765 12345'},
  {name:'Arjun K',regNo:'22CSE046',dept:'CSE',year:'II',email:'arjun@psna.ac.in',phone:'+91 98765 23456'},
  {name:'Priya K',regNo:'20CSE012',dept:'CSE',year:'IV',email:'priya@psna.ac.in',phone:'+91 98765 34567'},
  {name:'Rahul S',regNo:'19CSE008',dept:'CSE',year:'Grad',email:'rahul@psna.ac.in',phone:'+91 98765 45678'},
  {name:'Sneha V',regNo:'21EEE033',dept:'EEE',year:'III',email:'sneha@psna.ac.in',phone:'+91 98765 56789'},
  {name:'Karthik P',regNo:'22CSE078',dept:'CSE',year:'II',email:'karthik@psna.ac.in',phone:'+91 98765 67890'},
  {name:'Meena T',regNo:'20CSE077',dept:'CSE',year:'IV',email:'meena@psna.ac.in',phone:'+91 98765 78901'},
  {name:'Deepak R',regNo:'21CSE015',dept:'CSE',year:'III',email:'deepak@psna.ac.in',phone:'+91 98765 89012'},
  {name:'Anjali K',regNo:'23ECE022',dept:'ECE',year:'I',email:'anjali@psna.ac.in',phone:'+91 98765 90123'},
  {name:'Vikram B',regNo:'20CSE055',dept:'CSE',year:'IV',email:'vikram@psna.ac.in',phone:'+91 98765 01234'},
  {name:'Divya N',regNo:'21IT067',dept:'IT',year:'III',email:'divya@psna.ac.in',phone:'+91 98765 11111'},
  {name:'Sanjay M',regNo:'22EEE041',dept:'EEE',year:'II',email:'sanjay@psna.ac.in',phone:'+91 98765 22222'},
  {name:'Nandini R',regNo:'23CSE091',dept:'CSE',year:'I',email:'nandini@psna.ac.in',phone:'+91 98765 33333'},
  {name:'Gokul K',regNo:'20MECH028',dept:'MECH',year:'IV',email:'gokul@psna.ac.in',phone:'+91 98765 44444'},
  {name:'Swathi P',regNo:'21ECE038',dept:'ECE',year:'III',email:'swathi@psna.ac.in',phone:'+91 98765 55555'},
  {name:'Arun K',regNo:'22CSE056',dept:'CSE',year:'II',email:'arunk@psna.ac.in',phone:'+91 98765 66666'},
  {name:'Bhavya S',regNo:'20IT032',dept:'IT',year:'IV',email:'bhavya@psna.ac.in',phone:'+91 98765 77777'},
];
var certs=[
  {type:'Bonafide',need:'Academic',purpose:'Higher Studies — GRE Application'},
  {type:'Education Loan',need:'Financial',purpose:'Bank Loan Documentation'},
  {type:'CGPA/Percentage',need:'Academic',purpose:'Campus Placement Requirement'},
  {type:'Original',need:'Personal',purpose:'Passport Application'},
  {type:'Bonafide',need:'Academic',purpose:'Internship Proof'},
  {type:'Education Loan',need:'Financial',purpose:'Education Loan Sanction'},
  {type:'CGPA/Percentage',need:'Academic',purpose:'Post-Graduate Admission'},
  {type:'Original',need:'Academic',purpose:'Transfer Certificate'},
  {type:'Bonafide',need:'Personal',purpose:'Visa Application'},
  {type:'Education Loan',need:'Financial',purpose:'Scholarship Verification'},
  {type:'Original',need:'Academic',purpose:'Government Verification'},
  {type:'Bonafide',need:'Academic',purpose:'Competitive Exam Hall Ticket'},
  {type:'CGPA/Percentage',need:'Academic',purpose:'MS Abroad Application'},
  {type:'Original',need:'Personal',purpose:'Employment Verification'},
  {type:'Bonafide',need:'Financial',purpose:'Hostel Fee Concession'},
  {type:'Education Loan',need:'Academic',purpose:'Higher Studies Loan'},
  {type:'CGPA/Percentage',need:'Financial',purpose:'Scholarship Application'},
];
function makeApp(s,c,wf,st,ca,stps){
  return{id:nextId(c.type),type:c.type,need:c.need||'Academic',certificateType:c.type,purpose:c.purpose,copies:Math.floor(Math.random()*3)+1,status:st,currentApprover:ca,student:{name:s.name,regNo:s.regNo,department:s.dept,year:s.year,email:s.email,phone:s.phone},date:d(0).slice(0,10),lastUpdated:d(0).slice(0,10),rejectedBy:null,rejectionReason:null,rejectionDate:null,workflow:wf,steps:stps};
}
var apps=[];
var r=function(m){return Math.floor(Math.random()*m);};
var dayOffset = 0;
for(var i=0;i<4;i++){var s=students[i];var c=certs[i];var ap=makeApp(s,c,{tutor:'Pending',hod:'—',nodal:'—',os:'—',drs:'—'},'Pending','Tutor',[{role:'Tutor',status:'active',date:''},{role:'HOD',status:'pending',date:''},{role:'Nodal Officer',status:'pending',date:''},{role:'OS',status:'pending',date:''},{role:'DRS',status:'pending',date:''}]);ap.date=d(dayOffset).slice(0,10);ap.lastUpdated=d(dayOffset).slice(0,10);apps.push(ap);dayOffset+=2;}
for(var i=0;i<4;i++){var s=students[4+i];var c=certs[4+i];var ap=makeApp(s,c,{tutor:'Approved',hod:'Pending',nodal:'—',os:'—',drs:'—'},'Pending','HOD',[{role:'Tutor',status:'done',date:d(dayOffset+3)},{role:'HOD',status:'active',date:''},{role:'Nodal Officer',status:'pending',date:''},{role:'OS',status:'pending',date:''},{role:'DRS',status:'pending',date:''}]);ap.date=d(dayOffset).slice(0,10);ap.lastUpdated=d(dayOffset+3).slice(0,10);apps.push(ap);dayOffset+=2;}
for(var i=0;i<3;i++){var s=students[8+i];var c=certs[8+i];var ap=makeApp(s,c,{tutor:'Approved',hod:'Approved',nodal:'Pending',os:'—',drs:'—'},'Pending','Nodal Officer',[{role:'Tutor',status:'done',date:d(dayOffset+5)},{role:'HOD',status:'done',date:d(dayOffset+3)},{role:'Nodal Officer',status:'active',date:''},{role:'OS',status:'pending',date:''},{role:'DRS',status:'pending',date:''}]);ap.date=d(dayOffset).slice(0,10);ap.lastUpdated=d(dayOffset+5).slice(0,10);apps.push(ap);dayOffset+=2;}
for(var i=0;i<3;i++){var s=students[11+i];var c=certs[11+i];var ap=makeApp(s,c,{tutor:'Approved',hod:'Approved',nodal:'Approved',os:'Pending',drs:'—'},'Pending','OS',[{role:'Tutor',status:'done',date:d(dayOffset+7)},{role:'HOD',status:'done',date:d(dayOffset+5)},{role:'Nodal Officer',status:'done',date:d(dayOffset+3)},{role:'OS',status:'active',date:''},{role:'DRS',status:'pending',date:''}]);ap.date=d(dayOffset).slice(0,10);ap.lastUpdated=d(dayOffset+7).slice(0,10);apps.push(ap);dayOffset+=2;}
for(var i=0;i<3;i++){var s=students[14+i];var c=certs[14+i];var ap=makeApp(s,c,{tutor:'Approved',hod:'Approved',nodal:'Approved',os:'Approved',drs:'Pending'},'Pending','DRS',[{role:'Tutor',status:'done',date:d(dayOffset+9)},{role:'HOD',status:'done',date:d(dayOffset+7)},{role:'Nodal Officer',status:'done',date:d(dayOffset+5)},{role:'OS',status:'done',date:d(dayOffset+3)},{role:'DRS',status:'active',date:''}]);ap.date=d(dayOffset).slice(0,10);ap.lastUpdated=d(dayOffset+9).slice(0,10);apps.push(ap);dayOffset+=2;}
for(var i=0;i<3;i++){var s=students[r(17)];var c=certs[r(17)];var ap=makeApp(s,c,{tutor:'Approved',hod:'Approved',nodal:'Approved',os:'Approved',drs:'Approved'},'Approved','Completed',[{role:'Tutor',status:'done',date:d(dayOffset+3)},{role:'HOD',status:'done',date:d(dayOffset+5)},{role:'Nodal Officer',status:'done',date:d(dayOffset+7)},{role:'OS',status:'done',date:d(dayOffset+9)},{role:'DRS',status:'done',date:d(dayOffset+11)}]);ap.date=d(dayOffset).slice(0,10);ap.lastUpdated=d(dayOffset+11).slice(0,10);apps.push(ap);dayOffset+=2;}
for(var i=0;i<2;i++){var s=students[r(17)];var c=certs[r(17)];var rejectedBy=['Tutor','HOD'][i];var ap=makeApp(s,c,{tutor:i===0?'Rejected':'Approved',hod:i===1?'Rejected':'Approved',nodal:'—',os:'—',drs:'—'},'Rejected',rejectedBy,[{role:'Tutor',status:i===0?'rejected':'done',date:d(dayOffset-4)},{role:'HOD',status:i===1?'rejected':'pending',date:''},{role:'Nodal Officer',status:'pending',date:''},{role:'OS',status:'pending',date:''},{role:'DRS',status:'pending',date:''}]);ap.date=d(dayOffset).slice(0,10);ap.lastUpdated=d(dayOffset-4).slice(0,10);ap.rejectedBy=rejectedBy;ap.rejectionReason='Incomplete documentation — required documents not attached';ap.rejectionDate=d(dayOffset-4).slice(0,10);apps.push(ap);dayOffset+=2;}
localStorage.setItem('certificateApps',JSON.stringify(apps));
localStorage.setItem('seedInitializedV2','true');
})();
