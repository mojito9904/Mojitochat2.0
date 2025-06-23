window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("formcaptcha").addEventListener("submit", register);
});

document.getElementById("formcaptcha").addEventListener("keydown", function(event) {// per l'evento da tastiera
    if (event.key === "Enter") { 
        register(event);
    }
});

function indietro(event){
    event.preventDefault();
    window.location.href = "./index.html";
}

function check_password(pass1, pass2) {
    console.log(pass1 === pass2)
    return pass1 === pass2;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function pass_clicked() {
    const passwordField = document.getElementById('pass');
    const eyeIcon = document.getElementById('pass_clicked');

    // Cambia tipo dell'input tra 'password' e 'text'
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    } else {
        passwordField.type = 'password';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function check_clicked() {
    const passwordField = document.getElementById('check');
    const eyeIcon = document.getElementById('check_clicked');

    // Cambia tipo dell'input tra 'password' e 'text'
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    } else {
        passwordField.type = 'password';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function check_login() {
    const nick = document.getElementById('nick');
    const pass = document.getElementById('pass');
    const check = document.getElementById("check");
    const email= document.getElementById("email");
    const dim_div = document.getElementById("div_reg");

    const lung_min = 8;
    const lung_max = 20;
    const ver_num = /\d/;
    const ver_sp = /[!"£$%&/()^'ì€|,.-_*]/;
    const ver_email=/^[a-zA-Z0-9.,;:-_]+@[a-zA-Z0-9]+\.(com|it|net)$/;
    const ver_let=/^[A-Za-z]/;
    let valid = true;
    let div=0;

    // Controlla se il nickname è vuoto
    if (nick.value.trim() === "") {
        nick.style.borderColor = 'red';
        console.log("Nickname non inserito");
        document.getElementById("alert-nick").style.display = "block";
        valid = false;
    } else {
        nick.style.borderColor = 'white';
        document.getElementById("alert-nick").style.display = "none";
    }

    // controlla l'email
    if (email.value.trim() === "") {
        email.style.borderColor = 'red';
        console.log("email non inserito");
        document.getElementById("alert-email").style.display = "block";
        valid = false;
    } 
    else {
        email.style.borderColor = 'white';
        document.getElementById("alert-email").style.display = "none";

        if(!ver_email.test(email.value)||!ver_let.test(email.value)){
            email.style.borderColor='red';
            console.log("email non valida");
            document.getElementById("email_non_valida").style.display = "block";
            valid = false;
        }
        else{
            email.style.borderColor = 'white';
            document.getElementById("email_non_valida").style.display = "none";
        }
    }

    //----------CONTROLLO PASSWORD----------//
    // Controlla se la password è vuota
    if (pass.value.trim() === "") {
        pass.style.borderColor = 'red';
        console.log("Password non inserita");
        document.getElementById("alert-pass").style.display = "block";
        div++;
        console.log("pass", div);
        valid = false;
    } else {
        pass.style.borderColor = 'white';
        document.getElementById("alert-pass").style.display = "none";

        //verifica se password troppo corta
        if (pass.value.length < lung_min) {
            pass.style.borderColor = 'red';
            console.log("Password troppo corta");
            document.getElementById("alert-pass-lung-min").style.display = "block";
            valid = false;
            div++;
            console.log("min", div);
        } else {
            document.getElementById("alert-pass-lung-min").style.display = "none";
        }

        //verifica se password troppo lunga
        if (pass.value.length > lung_max) {
            pass.style.borderColor = 'red';
            console.log("Password troppo lunga");
            document.getElementById("alert-pass-lung-max").style.display = "block";
            valid = false;
            div++;
            console.log("max", div);
        } else {
            document.getElementById("alert-pass-lung-max").style.display = "none";
        }

        //verifica se ci sono numeri
        if (!ver_num.test(pass.value)) {
            pass.style.borderColor = 'red';
            console.log("Password mancante di numeri");
            document.getElementById("alert-pass-num").style.display = "block";
            valid = false;
            div++;
            console.log("num", div);
        } else {
            document.getElementById("alert-pass-num").style.display = "none";
        }

        //verifica se ci sono caratteri speciali
        if (!ver_sp.test(pass.value)) {
            pass.style.borderColor = 'red';
            console.log("Password mancante di caratteri speciali");
            document.getElementById("alert-pass-speciale").style.display = "block";
            valid = false;
            div++;
            console.log("spec", div);
        } else {
            document.getElementById("alert-pass-speciale").style.display = "none";
        }

        //ridimensionamento del div_reg
        switch(div){
            case 1:
                dim_div.style.height="420px";
                dim_div.style.width="350px";
                break;
            case 2:
                dim_div.style.height="420px";
                dim_div.style.width="350px";
                break;
            case 3:
                dim_div.style.height="450px";
                dim_div.style.width="350px";
                break;
        }
    }

    // Controlla se la conferma della password è uguale alla password
    if (check.value.trim() === "" || !check_password(pass.value, check.value)) {
        check.style.borderColor = 'red';
        console.log("Controllo password errato");
        document.getElementById("alert-check").style.display = "block";
        valid = false;
    } else {
        check.style.borderColor = 'white';
        document.getElementById("alert-check").style.display = "none";
    }

    return valid;
};

function convertToBase64(file){
    return new Promise((resolve, reject) => {
        //verifica se il file è definito e se è un oggetto di tipo File
        if (file && file instanceof File) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = function() {
                resolve(reader.result); //restituisce il risultato come base64
            };

            reader.onerror = function(error) {
                reject(error);
            };
        } else {
            reject(new Error("Il file non è valido o non è stato selezionato"));
        }
    });
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function register(event) {
    // Impedisci l'invio del form
    event.preventDefault();
    // Verifica se i campi sono validi
    if (!check_login()) {
        console.log("Dati non validi");
        return;
    };
   
    const nick = document.getElementById('nick').value;
    const pass = document.getElementById('pass').value;
    const email=document.getElementById("email").value;
    const file =document.getElementById("giumbo");//prende i file presente 
    let img_jpg;
    
    try {
        //controlla se l'utente ha messo immagini
        if (file.files.length>0){
            const img=file.files[0];//permette di prendere i primo e unico file presente nell'oggetto FileList creato dal browser
            img_jpg = await convertToBase64(img);//chiama la funzione per convertire file in jpg
            console.log("ci sono file")
            var response = await fetch('https://mojitochat.abgl.live/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Indica che stai inviando JSON
                },
                body: JSON.stringify({
                    nick: nick,
                    pass: pass,
                    email: email,
                    image: img_jpg
                })
            });
        }
        else {
            var response = await fetch('https://mojitochat.abgl.live/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Indica che stai inviando JSON
                },
                body: JSON.stringify({
                    nick: nick,
                    pass: pass,
                    email: email,
                    image: "",
                })
            });
        };

        if(response.ok){
            registerResponse = await response.json();
            console.log('Login successful');
            localStorage.setItem('token', registerResponse.token);
            window.location.href=`home.html`;
        }
        else{
            if (response.status === 409) {
                const registerResponse = await response.json(); 
                if (registerResponse.errore === "Email") {
                    document.getElementById("email_gia_uso").style.display = "block";
                    console.log("Risposta dal server");
                    console.log('Errore', registerResponse.errore);
                    console.log("messaggio", registerResponse.message);
                    return;
                }
                if (registerResponse.errore === "Nickname") {
                    document.getElementById("nick_gia_uso").style.display = "block";
                    console.log("Risposta dal server");
                    console.log('Errore', registerResponse.errore);
                    console.log("messaggio ", registerResponse.message);
                    return;
                }
            }
        };
    } 
    catch (error) {
        console.error('Si è verificato un errore:', error);
    };
  
    //const recaptchaResponse = grecaptcha.getResponse();

    /*if (recaptchaResponse.length === 0) {
        document.getElementById("alert-captcha").style.display = "block";
        return;
    }*/
};




