import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBScY1q4TtnFiWspbCh8TUCGxz2AQM5c58",
  authDomain: "glitch-links.firebaseapp.com",
  projectId: "glitch-links",
  storageBucket: "glitch-links.firebasestorage.app",
  messagingSenderId: "605163291802",
  appId: "1:605163291802:web:08be48906c9cc7aa254b23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const appDiv = document.getElementById("app");

const params = new URLSearchParams(window.location.search);
const username = params.get("user");
const editor = params.get("editor");

// 🎨 THEMES
const themes = {
  "dark": { bg:"#0f0f0f", text:"#fff" },
  "<<<<<TIDAL WAVE>>>>>": { bg:"linear-gradient(135deg,#1e90ff,#ffd700)", text:"#fff" },
  "stereo madness": { bg:"#0077ff", text:"#fff" },
  "oh god no": { bg:"linear-gradient(45deg,red,orange,yellow,green,cyan,blue,purple)", text:"#000" },
  "chatGPT": { bg:"#2b2b2b", text:"#e0e0e0" },
  "blue": { bg:"#0a3cff", text:"#fff" }
};

// =====================
// ✍️ EDITOR
// =====================

if (editor === "yes") {

  document.body.style.background="#111";
  document.body.style.color="#fff";
  document.body.style.fontFamily="Arial";
  document.body.style.textAlign="center";

  appDiv.innerHTML=`
    <h1>Create glitch-links🔥</h1>

    <input id="name" placeholder="username"><br><br>

    <textarea id="links" rows="6" placeholder="one link per line"></textarea><br><br>

    <select id="theme"></select><br><br>

    <button id="save">SAVE 🚀</button>
  `;

  const themeSel=document.getElementById("theme");
  Object.keys(themes).forEach(t=>{
    const o=document.createElement("option");
    o.value=t;
    o.innerText=t;
    themeSel.appendChild(o);
  });

  document.getElementById("save").onclick=async()=>{

    const name=document.getElementById("name").value.trim();

    let links=document.getElementById("links").value
      .split("\n")
      .map(l=>l.trim())
      .filter(l=>l);

    // 🔧 auto add https
    links=links.map(l=>{
      if(!l.startsWith("http://") && !l.startsWith("https://")){
        return "https://" + l;
      }
      return l;
    });

    const theme=themeSel.value;

    if(!name){
      alert("username missing 💀");
      return;
    }

    await setDoc(doc(db,"users",name),{
      links:links,
      theme:theme
    });

    window.location.href=`index.html?user=${name}`;
  };

}

// =====================
// 🌐 PROFILE
// =====================

else if(username){

  loadProfile(username);

}

// =====================
// 🏠 HOME
// =====================

else{

  document.body.style.background="#111";
  document.body.style.color="#fff";
  document.body.style.fontFamily="Arial";
  document.body.style.textAlign="center";

  appDiv.innerHTML=`
    <h1>glitch-links 🔥</h1>
    <p>Go to <b>?editor=yes</b> to create</p>
  `;

}

// =====================

function getLinkName(url){

  if(url.includes("instagram.com")) return "Insta 📸";
  if(url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube ▶️";
  if(url.includes("x.com") || url.includes("twitter.com")) return "X 🐦";
  if(url.includes("tiktok.com")) return "TikTok 🎵";
  if(url.includes("discord.gg") || url.includes("discord.com")) return "Discord 💬";

  return url.replace("https://","").replace("http://","");
}

// =====================

async function loadProfile(name){

  const snap=await getDoc(doc(db,"users",name));

  if(!snap.exists()){
    appDiv.innerHTML="<h1>User not found 💀</h1>";
    return;
  }

  const data=snap.data();
  const theme=themes[data.theme]||themes.dark;

  document.body.style.background=theme.bg;
  document.body.style.color=theme.text;
  document.body.style.fontFamily="Arial";
  document.body.style.textAlign="center";
  document.body.style.padding="40px";

  appDiv.innerHTML="";

  const title=document.createElement("h1");
  title.innerText=name;
  appDiv.appendChild(title);

  // 🌊 Spotify only tidal wave
  if(data.theme==="<<<<<TIDAL WAVE>>>>>"){
    const sp=document.createElement("div");
    sp.innerHTML=`
    <iframe style="border-radius:6px;max-width:200px;margin:20px auto;display:block"
      src="https://open.spotify.com/embed/track/4mTLnLuHoGhA2xd595OMg1"
      width="100%" height="176" frameborder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
    </iframe>`;
    appDiv.appendChild(sp);
  }

  data.links.forEach(url=>{
    const btn=document.createElement("a");
    btn.href=url;
    btn.target="_blank";
    btn.innerText=getLinkName(url);

    btn.style.display="block";
    btn.style.margin="12px auto";
    btn.style.padding="14px";
    btn.style.maxWidth="300px";
    btn.style.borderRadius="12px";
    btn.style.textDecoration="none";
    btn.style.background="#ffffff25";
    btn.style.color=theme.text;
    btn.style.backdropFilter="blur(6px)";

    appDiv.appendChild(btn);
  });
}

