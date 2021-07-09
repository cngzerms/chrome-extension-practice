const inputEl = document.querySelector("#input-el");
const inputBtn = document.querySelector("#input-btn");
const ulEl = document.querySelector("#ul-el");
const deleteBtn = document.querySelector("#delete-btn");
const saveTabBtn = document.querySelector("#tab-btn");
const buttonBox = document.querySelector(".button-box");

eventListeners();

function eventListeners(){
    document.addEventListener("DOMContentLoaded",loadAllLeads);
    inputBtn.addEventListener("click",addNewLead);
    deleteBtn.addEventListener("click",deleteAll);
    saveTabBtn.addEventListener("click",addLeadWithTab);
    ulEl.addEventListener("click",deleteLink);
}

function addNewLead(){
    const newLead = inputEl.value;
    if(isInclude(newLead)){
        showAlert("Bu link mevcut!","warning");
        inputEl.value = "";
    }else {
        renderLeads(newLead);
        setLeadsToLS(newLead);
        showAlert("Başarıyla eklendi!","success");
    }
}

function renderLeads(lead){
    const li = document.createElement("li");
    const a = document.createElement("a");
    const i = document.createElement("i");

    a.href = `${lead}`;
    a.appendChild(document.createTextNode(lead));
    a.setAttribute("target","_blank");
    
    i.className = "fas fa-times del2";
    i.style.float = "right";
    i.style.cursor = "pointer";
    
    li.appendChild(a);
    li.appendChild(i);
    ulEl.appendChild(li);

    inputEl.value = "";
}

function setLeadsToLS(newLead){
    let leads = getLeadsFromLS();
    leads.push(newLead);
    localStorage.setItem("myLeads",JSON.stringify(leads));
}

function getLeadsFromLS(){
    let leads;
    if(localStorage.getItem("myLeads") === null){
        leads = [];
    }else{
        leads = JSON.parse(localStorage.getItem("myLeads"));
    }
    return leads;
}

function deleteLink(e){
    if(e.target.classList.contains("del2")){
        e.target.parentElement.remove();
        deleteFromLS(e.target.previousElementSibling.innerHTML);
        showAlert("Başarıyla Silindi","success");
    }
}

function loadAllLeads(){
    let leads = getLeadsFromLS();
    leads.forEach(function(lead){
        renderLeads(lead);
    });
}

function deleteAll(){
    localStorage.clear();
    ulEl.innerHTML = "";
    showAlert("Başarıyla Temizlendi!","danger");
}

function deleteFromLS(text){
    let leads = getLeadsFromLS();
    for(let i=0; i < leads.length; i++){
        if(leads[i] === text){
            leads.splice(i,1);
        }
    }
    localStorage.setItem("myLeads",JSON.stringify(leads));
}

function addLeadWithTab(){

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        if(isInclude(tabs[0].url)){
            showAlert("Bu link mevcut!","warning");
            inputEl.value = "";
        }else{
            renderLeads(tabs[0].url);
            setLeadsToLS(tabs[0].url);
            showAlert("Başarıyla eklendi!","success");
        }
    });
}

function isInclude(newLead){
    let leads = getLeadsFromLS();
    return leads.includes(newLead);
}

function showAlert(msg,type) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.role = "alert";
    alert.setAttribute("style","margin-top:20px");
    alert.appendChild(document.createTextNode(msg));

    buttonBox.appendChild(alert);

    setTimeout(function(){
        alert.remove();
    },2000);    
}
