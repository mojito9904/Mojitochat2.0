document.getElementById("form_ind").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita il comportamento predefinito (ricaricare la pagina)

    let buttonClicked = document.activeElement.id; // Identifica quale bottone è stato premuto

    if (buttonClicked === "invio") {
        index();
    } else if (buttonClicked === "registrati") {
		window.location.href="./registrati.html";
    }
});

document.getElementById("form_ind").addEventListener("keydown", function(event) {
    if (event.key === "Enter") { 
        event.preventDefault();
        index();
    }
});

async function index(){
    const nick=document.getElementById('nick');
    const pass=document.getElementById('pass');
    const fild=document.getElementById('field');
    let loginResponse;
    if(nick.value.trim()==="" && pass.value.trim()===""){
        nick.style.borderColor = 'red';
        document.getElementById("alert-nick").style.display = "block";
        pass.style.borderColor = 'red';
        document.getElementById("alert-pass").style.display = "block";
        fild.style.height='250px';
        return;
    }
    if(nick.value.trim()===""){
        nick.style.borderColor = 'red';
        document.getElementById("alert-nick").style.display = "block";
        pass.style.borderColor = 'white';
        document.getElementById("alert-pass").style.display = "none";
        fild.style.height='250px';
        return;
    }
    if(pass.value.trim()===""){
        nick.style.borderColor = 'white';
        document.getElementById("alert-nick").style.display = "none";
        pass.style.borderColor = 'red';
        document.getElementById("alert-pass").style.display = "block";
        fild.style.height='250px';
        return;
    }
    try {
        const response = await fetch('https://mojitochat.abgl.live/api/login', {
        method: 'POST',
        headers: {
            'nick': nick.value,
            'pass': pass.value    
        }
        });
        if(response.ok){//vede se risposta è status 200
            loginResponse = await response.json();
            console.log('Login successful:', loginResponse);
            localStorage.setItem('token', loginResponse.token);
            nick.value="";
            pass.value="";
            window.open(`home.html`);
        }
        else{
            if(response.status===400){
                loginResponse=await response.json();
                console.log(loginResponse.errore)
                if (loginResponse.errore==="Utente non presente nel db") { 
                    alert("Non sei registrato");
                    return;
                }
                if(loginResponse.errore==="Passowrd sbagliata"){
                    alert("La password è sbagliata");
                    return;
                }
                }
            }
    }
    catch (error) {
        console.error('Error:', error);
        return;

    }
}
/*------------------------------------------------------------------------------------------------------*/ 
/* ecco a chi devo tagliare le mani mi dava errore e non sapevo perchè*/
/*------------------------------------------------------------------------------------------------------*/

