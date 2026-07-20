'use strict';
(function(){
if(localStorage.getItem('seedInitialized'))return;
const now=new Date();const d=(n)=>new Date(now-n*86400000).toISOString();
const students=[
  {name:'Kaviya S',regNo:'21CSE045',dept:'CSE',year:'III',email:'kaviya@psna.ac.in',phone:'+91 98765 12345'},
  {name:'Arjun R',regNo:'22IT023',dept:'IT',year:'II',email:'arjun@psna.ac.in',phone:'+91 98765 23456'},
  {name:'Priya M',regNo:'20ECE012',dept:'ECE',year:'IV',email:'priya@psna.ac.in',phone:'+91 98765 34567'},
  {name:'Rahul K',regNo:'19MECH008',dept:'MECH',year:'Grad',email:'rahul@psna.ac.in',phone:'+91 98765 45678'},
  {name:'Sneha V',regNo:'21EEE033',dept:'EEE',year:'III',email:'sneha@psna.ac.in',phone:'+91 98765 56789'},
  {name:'Karthik P',regNo:'22CSE078',dept:'CSE',year:'II',email:'karthik@psna.ac.in',phone:'+91 98765 67890'},
  {name:'Meena R',regNo:'20IT045',dept:'IT',year:'IV',email:'meena@psna.ac.in',phone:'+91 98765 78901'},
  {name:'Deepak S',regNo:'21MECH015',dept:'MECH',year:'III',email:'deepak@psna.ac.in',phone:'+91 98765 89012'},
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
const certs=[
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
function makeApp(idx,s,c,wf,st,ca,stps){
  return{id:'APP-2026-'+String(idx+1).padStart(4,'0'),type:c.type,need:c.need||'Academic',certificateType:c.type,purpose:c.purpose,copies:Math.floor(Math.random()*3)+1,status:st,currentApprover:ca,student:{name:s.name,regNo:s.regNo,department:s.dept,year:s.year,email:s.email,phone:s.phone},date:d(idx+20).slice(0,10),lastUpdated:d(idx+18).slice(0,10),rejectedBy:null,rejectionReason:null,rejectionDate:null,workflow:wf,steps:stps};
}
const apps=[];
const r=(m)=>Math.floor(Math.random()*m);
// 4 pending at Tutor
for(let i=0;i<4;i++){const s=students[i];const c=certs[i];apps.push(makeApp(i,s,c,{tutor:'Pending',hod:'—',nodal:'—',os:'—',drs:'—'},'Pending','Tutor',[{role:'Tutor',status:'active',date:''},{role:'HOD',status:'pending',date:''},{role:'Nodal Officer',status:'pending',date:''},{role:'OS',status:'pending',date:''},{role:'DRS',status:'pending',date:''}]));}
// 4 pending at HOD
for(let i=0;i<4;i++){const s=students[4+i];const c=certs[4+i];apps.push(makeApp(4+i,s,c,{tutor:'Approved',hod:'Pending',nodal:'—',os:'—',drs:'—'},'Pending','HOD',[{role:'Tutor',status:'done',date:d(10)},{role:'HOD',status:'active',date:''},{role:'Nodal Officer',status:'pending',date:''},{role:'OS',status:'pending',date:''},{role:'DRS',status:'pending',date:''}]));}
// 3 pending at Nodal
for(let i=0;i<3;i++){const s=students[8+i];const c=certs[8+i];apps.push(makeApp(8+i,s,c,{tutor:'Approved',hod:'Approved',nodal:'Pending',os:'—',drs:'—'},'Pending','Nodal Officer',[{role:'Tutor',status:'done',date:d(12)},{role:'HOD',status:'done',date:d(10)},{role:'Nodal Officer',status:'active',date:''},{role:'OS',status:'pending',date:''},{role:'DRS',status:'pending',date:''}]));}
// 3 pending at OS
for(let i=0;i<3;i++){const s=students[11+i];const c=certs[11+i];apps.push(makeApp(11+i,s,c,{tutor:'Approved',hod:'Approved',nodal:'Approved',os:'Pending',drs:'—'},'Pending','OS',[{role:'Tutor',status:'done',date:d(14)},{role:'HOD',status:'done',date:d(12)},{role:'Nodal Officer',status:'done',date:d(10)},{role:'OS',status:'active',date:''},{role:'DRS',status:'pending',date:''}]));}
// 3 pending at DRS
for(let i=0;i<3;i++){const s=students[14+i];const c=certs[14+i];apps.push(makeApp(14+i,s,c,{tutor:'Approved',hod:'Approved',nodal:'Approved',os:'Approved',drs:'Pending'},'Pending','DRS',[{role:'Tutor',status:'done',date:d(16)},{role:'HOD',status:'done',date:d(14)},{role:'Nodal Officer',status:'done',date:d(12)},{role:'OS',status:'done',date:d(10)},{role:'DRS',status:'active',date:''}]));}
// 3 fully approved
for(let i=0;i<3;i++){const s=students[r(17)];const c=certs[r(17)];apps.push(makeApp(17+i,s,c,{tutor:'Approved',hod:'Approved',nodal:'Approved',os:'Approved',drs:'Approved'},'Approved','Completed',[{role:'Tutor',status:'done',date:d(20)},{role:'HOD',status:'done',date:d(18)},{role:'Nodal Officer',status:'done',date:d(16)},{role:'OS',status:'done',date:d(14)},{role:'DRS',status:'done',date:d(12)}]));}
// 2 rejected
for(let i=0;i<2;i++){const s=students[r(17)];const c=certs[r(17)];const rejectedBy=['Tutor','HOD'][i];apps.push(makeApp(20+i,s,c,{tutor:i===0?'Rejected':'Approved',hod:i===1?'Rejected':'Approved',nodal:'—',os:'—',drs:'—'},'Rejected',rejectedBy,[{role:'Tutor',status:i===0?'rejected':'done',date:d(6)},{role:'HOD',status:i===1?'rejected':'pending',date:''},{role:'Nodal Officer',status:'pending',date:''},{role:'OS',status:'pending',date:''},{role:'DRS',status:'pending',date:''}]));apps[apps.length-1].rejectedBy=rejectedBy;apps[apps.length-1].rejectionReason='Incomplete documentation — required documents not attached';apps[apps.length-1].rejectionDate=d(4).slice(0,10);}
localStorage.setItem('certificateApps',JSON.stringify(apps));
localStorage.setItem('seedInitialized','true');
})();
