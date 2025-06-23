/* import librerie*/
const sharp = require('sharp');
const nodemailer = require("nodemailer");
const express = require("express");
const fs = require('fs');
const path = require("path");
const {Client}=require('pg');
const websocket=require('ws');
//per creare uuid
const { v4: uuidv4 } = require("uuid");
/*constanti*/
const app = express();
const PORT = process.env.PORT || 19610;
const wss = new websocket.Server({ port: 19710 });


/* Connessione DB PostgreSQL */
const db = new Client({
	user: 'USERNAME_DB',         // <-- INSERIRE USERNAME REALE
	password: 'PASSWORD_DB',     // <-- INSERIRE PASSWORD REALE
	host: 'localhost',
	port: '5432',
	database: 'mojitochat',
});

/* Configurazione SMTP */
var transport = nodemailer.createTransport({
    host: "SMTP_HOST",     // <-- INSERIRE HOST SMTP REALE (es. smtp.gmail.com)
    port: 587,
    auth: {
      user: "SMTP_USER",   // <-- INSERIRE USERNAME SMTP
      pass: "SMTP_PASS"    // <-- INSERIRE PASSWORD SMTP
    }
});
*permette di inviare le email usando l'api di un server SMTP */

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

// Middleware
app.use(express.json({limit: "5mb"}));

// Static server
app.use(express.static("../webclient"));
app.use('/immag', express.static(path.join(__dirname, 'immagini')));
//per cryptare password
const bcrypt = require('bcrypt');
// Routes
app.get("/api/ping", (req, res) => {
    res.send("pong!");
});

// websocket
const clients=new Set();
let persone;

wss.on('connection', function connection(ws){
    clients.add(ws); 
    console.log('🟢 Nuovo client connesso (ws)');
    persone=clients.size;
    broadcast({persone: persone});
    console.log(persone);
    
    ws.on('message', function incoming(message){
        const msg=Buffer.isBuffer(message) ? message.toString() : message;//verifica se è un buffer 

        try{
            const mg=JSON.parse(msg);
            console.log(`📩 Messaggio da ${mg.nome}: ${mg.frase}; (IMMAGINE: ${mg.immg})`);

            const mio=JSON.stringify(mg);
            
            clients.forEach(client=>{
                if(client.readyState===websocket.OPEN && client!=ws){
                    client.send(mio);
                };
            });
        }
        catch(e){
            console.log(e);
        }
    });

    ws.on('close', ()=>{
        console.log("🔴 Un client si è disconnesso");
        clients.delete(ws);
        persone=clients.size;
        broadcast({persone: persone});
        console.log(persone);
    });

    function broadcast(data){
        const msg=JSON.stringify(data);
        //inoltra il messaggio a tutti gli altri client
        clients.forEach(client=>{
            if(client.readyState===websocket.OPEN){
                client.send(msg);
            };
        });
    };
});

//perte login finita future revisioni
app.post("/api/login", async(req, res) => {

    const {nick}=req.headers;
    const {pass}=req.headers;
  
    try {
        //verifica se l'utente che si sta loggando è presente nel db
        const result = await db.query("SELECT id,username,email,password,token FROM users WHERE username = $1", [nick]);  
        if(result.rows.length===0){
            res.status(400).send(JSON.stringify({
                errore:"Utente non presente nel db",
            }))
            return;
        }
        else{
            // Confronta la password inserita con l'hash salvato
            const user=result.rows[0];
            const isMatch = await bcrypt.compare(pass, user.password);
            if (isMatch) {
                uuid=uuidv4();
                res.status(200).json({
                    token:uuid
                });
                // Log dell'accesso
                console.log(`Accesso riuscito di ${user.username}`);
                await db.query("UPDATE users SET token = $1 WHERE id = $2", [uuid, user.id]);
                const now = new Date();
                const formattedDate = now.toLocaleDateString('it-IT', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
                const formattedTime = now.toLocaleTimeString('it-IT');
                await transport.sendMail({
                    from: "mojitochat@abgl.live",
                    to: user.email,
                    subject: `Bentornato ${user.username} su Mojitochat`,
                    html:`
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <meta charset="UTF-8">
                            <title>MojitoChat Accesso</title>
                        </head>
                        <body style="background-color: black">
                            <p>accesso effettuato su MojitoChat: il giorno <strong>${formattedDate}</strong> alle ore <strong>${formattedTime}</strong></p>
                            <a href="home.html"
                        </body>
                    </html>`
                });
                return;
            }
            else {
                res.status(400).send(JSON.stringify({
                    errore:"Passowrd sbagliata"
                }))
                return;
            }
            
        }
    } catch (error) {
        res.status(500).send(JSON.stringify({
            code: error.message
        }));
        return;
    }
    
});

// Route di registrazione completata e corretta futura revisione
app.post("/api/register", async (req, res) => {
    const { nick, pass, email, image} = req.body;

    try {
        const saltRounds = 10;
        const password = await bcrypt.hash(pass, saltRounds);

        //verifica se username già in uso 
        const verifica_nome = await db.query("SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)", [nick]);
        if (verifica_nome.rows[0].exists) {
            //se già in uso 
            console.log("Username già esistente.");
            return res.status(409).send(JSON.stringify({ 
                errore:"Nickname",
                messsage: 'Nickname già in uso'
            }));
            /*
            409 Conflict questo codice indica che la richiesta non può essere completata a causa di un conflitto con lo stato attuale della risorsa.
            In questo caso il conflitto viene dal fatto che l'username già esiste
             */
        }
        const verifica_email=await db.query("SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)",[email]);
        if(verifica_email.rows[0].exists){
            console.log("email già in uso");
            return res.status(409).send(JSON.stringify({ 
                errore: 'Email',
                message:"Email già in uso"

            }));
        }

        //genera token 
        const uuid = uuidv4();
        //se non c'è image
        if (!image) {
            const result = await db.query(
                "INSERT INTO users(username, email, password, token) VALUES ($1,$2,$3,$4) RETURNING *",
                [nick, email, password, uuid]
            );
            console.log('Utente inserito:', result.rows[0]);
        }
        else {
            const filename = "image_" + uuid + ".jpg";  //creiamo il nome della foto mettendo uuid
            const base64Data = image.replace(/^data:image\/[a-zA-Z]*;base64,/, ''); 
            const filePath = path.join(__dirname, 'immagini', filename);  //percorso salvataggio del file
            const buffer = Buffer.from(base64Data, 'base64');//Un Buffer è una classe che permette di lavorare direttamente con dati binari in Node.js. P
            //coversione della foto di qualsiasi formato in una foto JPEG
            await sharp(buffer)
                .jpeg({ quality: 80 })  //mettiamo la qualità della foto all'80%
                .toFile(filePath);//salviamo la foto nel percorso specificato

            // Inserisci nel database con il nome del file
            const result = await db.query(
            "INSERT INTO users(username, email, password, token, image) VALUES ($1,$2,$3,$4,$5) RETURNING *",
            [nick, email, password, uuid, filename]
            );
            console.log('Utente inserito:', result.rows[0]);
        }
        //invia token 
        res.status(201).json({
        token: uuid
        });
    } catch (error) {
        console.error("Errore nell'inserimento:", error);
        res.status(500).send(JSON.stringify({
            errore: "Errore nell'inserimento dei dati nel database",
            code: error.message
        }));
        return;
    }
});

////recupero immagine profilo////
app.post("/api/immagine", async (req, res) => {
    try {
        const {token}=req.body;

        const result = await db.query("SELECT username, image FROM users WHERE token = $1", [token]);
        if(result.rows.length === 0){
            res.status(400).json({ message: "utente non trovato"}); return;
        }

        const user=result.rows[0].username;
        const imagine=result.rows[0].image;
        const sardina=`https://mojitochat.abgl.live/immag/${imagine}`;

        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        res.json({user, sardina});
    } 
    catch(error) {
        console.log("Errore nel recupero dell'immagine:", error);
        res.status(500).json({ message: "Errore del server"});
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

