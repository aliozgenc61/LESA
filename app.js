let supabaseClient;

const $ = (id) => document.getElementById(id);
const screens = ["configScreen","authScreen","dashboardScreen"];

function show(id){
  screens.forEach(x => $(x).classList.add("hidden"));
  $(id).classList.remove("hidden");
  $("logoutBtn").classList.toggle("hidden", id !== "dashboardScreen");
}

function getConfig(){
  return {
    url: localStorage.getItem("lesa_supabase_url"),
    key: localStorage.getItem("lesa_supabase_key")
  };
}

function initClient(){
  const {url,key} = getConfig();
  if(!url || !key) return false;
  supabaseClient = window.supabase.createClient(url,key);
  return true;
}

async function start(){
  if(!initClient()){ show("configScreen"); return; }
  const {data:{session}} = await supabaseClient.auth.getSession();
  if(session){ show("dashboardScreen"); await loadDashboard(); }
  else show("authScreen");
}

$("saveConfigBtn").onclick = async () => {
  const url = $("supabaseUrl").value.trim();
  const key = $("supabaseKey").value.trim();
  if(!url || !key){ alert("URL ve anon key zorunludur."); return; }
  localStorage.setItem("lesa_supabase_url",url);
  localStorage.setItem("lesa_supabase_key",key);
  await start();
};

$("loginBtn").onclick = async () => {
  $("authMessage").textContent = "Giriş yapılıyor...";
  const {error} = await supabaseClient.auth.signInWithPassword({
    email:$("email").value.trim(), password:$("password").value
  });
  if(error){ $("authMessage").textContent = error.message; return; }
  $("authMessage").textContent = "";
  show("dashboardScreen");
  await loadDashboard();
};

$("logoutBtn").onclick = async () => {
  await supabaseClient.auth.signOut();
  show("authScreen");
};

$("refreshBtn").onclick = loadDashboard;

async function count(table, filter){
  let q = supabaseClient.from(table).select("*",{count:"exact",head:true});
  if(filter) q = filter(q);
  const {count,error} = await q;
  if(error) throw error;
  return count || 0;
}

async function loadDashboard(){
  try{
    const today = new Date();
    const in7 = new Date(today); in7.setDate(today.getDate()+7);
    const in90 = new Date(today); in90.setDate(today.getDate()+90);
    const iso = d => d.toISOString().slice(0,10);

    const [
      openTenders, nearTenders, lateOrders, lateInvoices, expiringGuarantees, openTasks
    ] = await Promise.all([
      count("tenders", q => q.in("status",["Yeni","İncelemede","Teklif Hazırlanıyor","Onay Bekliyor","Teklif Verildi"])),
      count("tenders", q => q.gte("tender_date",iso(today)).lte("tender_date",iso(in7))),
      count("orders", q => q.lt("due_date",iso(today)).is("shipment_date",null)),
      count("invoices", q => q.lt("due_date",iso(today)).gt("amount",0)),
      count("guarantees", q => q.gte("end_date",iso(today)).lte("end_date",iso(in90))),
      count("tasks", q => q.in("status",["Açık","Devam Ediyor","Beklemede"]))
    ]);

    $("openTenders").textContent=openTenders;
    $("nearTenders").textContent=nearTenders;
    $("lateOrders").textContent=lateOrders;
    $("lateInvoices").textContent=lateInvoices;
    $("expiringGuarantees").textContent=expiringGuarantees;
    $("openTasks").textContent=openTasks;

    const {data,error} = await supabaseClient.from("tasks")
      .select("id,title,department,owner,due_date,status,priority")
      .in("status",["Açık","Devam Ediyor","Beklemede"])
      .order("due_date",{ascending:true,nullsFirst:false})
      .limit(12);
    if(error) throw error;
    $("taskList").innerHTML = (data||[]).map(t => `
      <div class="item"><b>${escapeHtml(t.title)}</b>
      <div class="meta">${escapeHtml(t.department||"-")} · ${escapeHtml(t.owner||"Sorumlu yok")} · ${t.due_date||"Tarih yok"} · ${escapeHtml(t.status)}</div></div>
    `).join("") || "<div class='meta'>Açık görev bulunmuyor.</div>";
  }catch(e){
    alert("Veri okunamadı: "+e.message);
  }
}

$("addTaskBtn").onclick = async () => {
  const title=$("taskTitle").value.trim();
  if(!title){ $("taskMessage").textContent="Görev başlığı zorunludur."; return; }
  const {error}=await supabaseClient.from("tasks").insert({
    title,
    department:$("taskDepartment").value,
    owner:$("taskOwner").value.trim()||null,
    due_date:$("taskDueDate").value||null,
    status:"Açık",
    priority:"Orta"
  });
  if(error){ $("taskMessage").textContent=error.message; return; }
  $("taskMessage").textContent="Görev eklendi.";
  $("taskTitle").value=""; $("taskOwner").value=""; $("taskDueDate").value="";
  await loadDashboard();
};

function escapeHtml(v){
  return String(v??"").replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[s]));
}

start();
