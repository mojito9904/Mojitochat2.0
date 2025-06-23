const chat=document.getElementById("chat");
const frase=document.getElementById("frase");

/*PARTE DEL TELEFONO*/ 
document.addEventListener("DOMContentLoaded", function() {
    const bbq=document.getElementById("menu-icon");
    const vallelata=document.getElementById("arrow"); 

    bbq.onclick=function(){
        const menu=document.getElementById("window_impostazioni");
        /*getComputedStyle ottiene tutti gli stili di menu nel file css*/ 
        if(getComputedStyle(menu).display==="none"){
            chat.style.visibility="hidden";
            menu.style.display="block";
            document.getElementById("window_onlineusers").style.visibility="hidden";
            document.getElementById("window_account").style.visibility="hidden";
            document.getElementById("window_logout").style.visibility="hidden";
        }
        else{
            document.getElementById("window_onlineusers").style.visibility="hidden";
            document.getElementById("window_account").style.visibility="hidden";
            document.getElementById("window_logout").style.visibility="hidden";
            menu.style.display="none";
            chat.style.visibility="visible";
        }
    }

    vallelata.onclick= function(){
        if(frase.value==="") return;
        invio_messaggio();
        frase.value="";
    }
});

//per l'immagine profilo
let fisico, foglia;

document.addEventListener("DOMContentLoaded", async function(){
    try{
        const response=await fetch(`https://mojitochat.abgl.live/api/immagine`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({token: localStorage.getItem("token")})
        });

        if(response.ok){
            const ak47=await response.json();

            foglia=ak47.user;
            document.getElementById("frantoio").innerText=foglia;

            fisico=ak47.sardina;
            document.getElementById("greg").src=fisico;

            console.log(ak47);
        }else{
            console.log("Errore nel recupero dell'immagine:");
        }
    } 
    catch(error){
        console.log("Errore nel caricamento dell'immagine:", error);
    }
});

function invio_messaggio(){
    if(frase.value.lenght>500) return alert("messaggio troppo lungo");

    ws.send(JSON.stringify({
        nome: foglia,
        frase: frase.value,
        immg: fisico
    }));

    //creazione messaggio
    const mess=document.getElementById("mess");
    const message=document.createElement("div");
    message.classList.add("m");// stile
    message.textContent=frase.value;

    if(mess.children.length===0){
        mess.appendChild(message);
    }
    else{
        mess.insertBefore(message, mess.firstChild);
    }
}

//--------websocket----------//
const ws=new WebSocket('wss://mojitochat.abgl.live');
///////////////////////////////

ws.onopen=()=>{
    console.log("✅ Connesso al server WebSocket");
};

ws.addEventListener('message', (event)=>{
    const mess=document.getElementById("mess");

    let data;
    try{
        data=JSON.parse(event.data);
    } 
    catch(errore){
        console.log("Messaggio normale:", event.data);
    };
    
    if(typeof data.persone==="number"){
        console.log(data);
        const dopo=document.getElementById("online");
        const prima=parseInt(dopo.innerText);
        dopo.innerText=data.persone;

        const nota=document.createElement("div");
        nota.classList.add("sasso");

        if(data.persone<prima){
            console.log(data.nome);
            nota.textContent="un utente si è disconnesso";
        }
        else{
            nota.textContent="un utente si è connesso";
        };
        mess.insertBefore(nota, mess.firstChild);

        setTimeout(()=>{
            nota.remove();
        }, 4000);
        return;
    };

    const tartaruga=document.createElement("img");
    tartaruga.classList.add("faro");
    tartaruga.src=data.immg;

    const palle=document.createElement("p");
    palle.textContent=data.nome;

    const p=document.createElement("div");
    p.classList.add("ganzo");
    p.appendChild(tartaruga);
    p.appendChild(palle);

    const content=document.createElement("div");
    content.classList.add("vodka");
    content.textContent=data.frase;

    const message=document.createElement("div");
    message.classList.add("sasso");
    message.style.height="auto";
    message.appendChild(p);
    message.appendChild(content);

    if(mess.children.length===0){
        mess.appendChild(message);
    }
    else{
        mess.insertBefore(message, mess.firstChild);
    };
});


document.getElementById("frase").addEventListener("keydown", function(event){
    if(window.innerWidth<=768) return;

    if(event.shiftKey && event.key==="Enter"){
        console.log("oooooooooooooooooohhh");
    };

    if(event.key==="Enter" && frase.value!=""){
        event.preventDefault();
        invio_messaggio();
        this.value="";
    }
    else return;
});

document.getElementById("settings").addEventListener("click",()=>{
    if(getComputedStyle(document.getElementById("window_impostazioni")).display==="none"){
        document.getElementById("window_impostazioni").style.display="block";
        chat.style.visibility="hidden";
    }
    else{
        document.getElementById("window_impostazioni").style.display="none";
        chat.style.visibility="visible";
    };
});

function Close_Settings(){
    document.getElementById("window_impostazioni").style.display="none";
    chat.style.visibility="visible";
}

function Open_Account(){
    document.getElementById("window_impostazioni").style.display="none";
    document.getElementById("window_account").style.visibility="visible";
};
function Close_Account(){
    document.getElementById("window_account").style.visibility="hidden";
    document.getElementById("window_impostazioni").style.display="block";
};

function Open_Logout(){
    document.getElementById("window_impostazioni").style.display="none";
    document.getElementById("window_logout").style.visibility = "visible";
};
function Close_Logout(){
    document.getElementById("window_logout").style.visibility = "hidden";
    document.getElementById("window_impostazioni").style.display="block";
};























