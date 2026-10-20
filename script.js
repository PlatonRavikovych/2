const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSynthesizedSound(type) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'horn') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.setValueAtTime(470, now + 0.08);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.35);

  } else if (type === 'bass') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.45);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    osc.start(now);
    osc.stop(now + 0.45);

  } else if (type === 'laser') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(990, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);

  } else {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.start(now);
    osc.stop(now + 0.25);
  }
}

const soundBoard = {
  "q": { title: "Airhorn", soundType: "horn", count: 0 },
  "w": { title: "808 Bass", soundType: "bass", count: 0 },
  "e": { title: "Laser Shot", soundType: "laser", count: 0 },
  "r": { title: "Synth Beep", soundType: "beep", count: 0 }
};

const padsContainer = document.getElementById("pads");
const nowPlaying = document.getElementById("nowPlaying");

function renderBoard() {
    padsContainer.innerHTML = "";

    for (let key in soundBoard) {
        const sample = soundBoard[key];
        const btn = document.createElement("button");

        btn.className = "pad-btn";
        btn.id = `pad-${key}`;

        btn.innerHTML = `
            <div class="key">${key}</div>
            <div class="name">${sample.title}</div>
            <div class="count">
                Натиснуто: <strong>${sample.count}</strong>
            </div>
        `;

        btn.onclick = () => {
            triggerKey(key);
        };

        padsContainer.appendChild(btn);
    }
}

renderBoard();

function triggerKey(key) {
    key = key.toLowerCase();

    if (soundBoard[key]) {
        let item = soundBoard[key];
        playSynthesizedSound(item.soundType);

        item.count++;

        nowPlaying.innerHTML = `Now Playing: ${item.title}`;
    }

    renderBoard();

    const padEl = document.getElementById(`pad-${key}`);

    if (padEl) {
        padEl.classList.add("active");
        setTimeout(() => padEl.classList.remove("active"), 150);
    }
}

function deleteSample() {
  const input = document.getElementById("deleteKeyInput");
  const key = input.value.trim().toLowerCase();

  if (!key) {
    alert("Будь ласка, введіть клавішу для видалення!");
    return;
  }

  if (key in soundBoard) {
    delete soundBoard[key];
    renderBoard();
    input.value = "";
  } 
  
  else {
    alert(`Клавішу "${key}" не знайдено в пульті!`);
  }
}

window.addEventListener("keydown", (event) => {
    if(event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT'){
        return;
    }

    triggerKey(event.key);
})

document.getElementById("addBtn").onclick = function() {
    const key = document.getElementById("inputKey");
    const name = document.getElementById("inputName");
    const type = document.getElementById("inputType");

    const keyValue = key.value.trim().toLowerCase();
    const nameValue = name.value.trim();
    const typeValue = type.value.trim();

    if(keyValue !== '' && nameValue !== '') {
        soundBoard[keyValue] = { title: nameValue, soundType: typeValue, count: 0 };
        key.value = '';
        name.value = '';
        renderBoard();
    }
    else {
        alert("Заповніть всі поля!");
    }
}