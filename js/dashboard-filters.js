'use strict';
(function(){
if(window._certFiltersInited)return;
window._certFiltersInited=true;

const FILTERS=[
  {label:'All',value:'all'},
  {label:'Original Certificate',value:'Original'},
  {label:'Bonafide Certificate',value:'Bonafide'},
  {label:'CGPA / Percentage',value:'CGPA/Percentage'},
  {label:'Education Loan',value:'Education Loan'},
  {label:'Community Certificate',value:'Community'},
  {label:'Income Certificate',value:'Income'},
  {label:'Conduct Certificate',value:'Conduct'},
  {label:'Nativity Certificate',value:'Nativity'},
  {label:'Migration Certificate',value:'Migration'},
  {label:'Transfer Certificate (TC)',value:'TC'},
  {label:'Any Other Certificate',value:'Other'}
];

const FILTER_CSS=`.filter-btn{padding:8px 18px;border-radius:100px;font-size:0.75rem;font-weight:700;cursor:pointer;transition:all 0.25s ease;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.5);white-space:nowrap;margin-bottom:4px}.filter-btn:hover{background:rgba(212,174,112,0.12);border-color:rgba(212,174,112,0.2);color:#D4AE70}.filter-btn.active{background:rgba(212,174,112,0.15);border-color:#D4AE70;color:#D4AE70;box-shadow:0 0 20px rgba(212,174,112,0.1)}`;

function injectCSS(){
  if(!document.querySelector('#filter-btn-style')){
    var s=document.createElement('style');
    s.id='filter-btn-style';
    s.textContent=FILTER_CSS;
    document.head.appendChild(s);
  }
}

function renderFilterBar(containerId){
  var container=document.getElementById(containerId);
  if(!container)return;
  container.innerHTML=FILTERS.map(function(f){
    return'<button class="filter-btn'+(f.value==='all'?' active':'')+'" data-filter="'+f.value+'" onclick="window._certFilterSet(\''+f.value+'\')">'+f.label+'</button>';
  }).join('');
}

window._certFilterCurrent='all';
window._certFilterRenderFn=null;

window._certFilterSet=function(value){
  window._certFilterCurrent=value;
  var btns=document.querySelectorAll('.filter-btn');
  btns.forEach(function(b){b.classList.toggle('active',b.getAttribute('data-filter')===value);});
  if(typeof window._certFilterRenderFn==='function'){
    window._certFilterRenderFn();
  }
};

window.initCertFilter=function(opts){
  injectCSS();
  renderFilterBar(opts.containerId||'filterTabs');
  window._certFilterRenderFn=opts.renderFn||function(){};
  window._certFilterCurrent='all';
};

})();
