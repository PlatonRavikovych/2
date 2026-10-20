const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(soundKind) {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const currentTime = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const volumeNode = audioContext.createGain();

  oscillator.connect(volumeNode);
  volumeNode.connect(audioContext.destination);

  if (soundKind === 'horn') {
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(420, currentTime);
    oscillator.frequency.setValueAtTime(470, currentTime + 0.08);
    volumeNode.gain.setValueAtTime(0.3, currentTime);
    volumeNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.35);
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.35);

  } else if (soundKind === 'bass') {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(40, currentTime + 0.45);
    volumeNode.gain.setValueAtTime(0.5, currentTime);
    volumeNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.45);
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.45);

  } else if (soundKind === 'laser') {
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(990, currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, currentTime + 0.2);
    volumeNode.gain.setValueAtTime(0.25, currentTime);
    volumeNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.2);
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.2);

  } else {
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(520, currentTime);
    volumeNode.gain.setValueAtTime(0.3, currentTime);
    volumeNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.25);
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.25);
  }
}

const padsData = {
  "q": { title: "Airhorn", soundType: "horn", count: 0 },
  "w": { title: "808 Bass", soundType: "bass", count: 0 },
  "e": { title: "Laser Shot", soundType: "laser", count: 0 },
  "r": { title: "Synth Beep", soundType: "beep", count: 0 }
};

const padsBox = document.getElementById("pads");
const statusLabel = document.getElementById("nowPlaying");

function drawPads() {
    padsBox.innerHTML = "";

    for (let padKey in padsData) {
        const padItem = padsData[padKey];
        const padButton = document.createElement("button");

        padButton.className = "pad-btn";
        padButton.id = `pad-${padKey}`;

        padButton.innerHTML = `
            <div class="key">${padKey}</div>
            <div class="name">${padItem.title}</div>
            <div class="count">
                Натиснуто: <strong>${padItem.count}</strong>
            </div>
        `;

        padButton.onclick = () => {
            pressPad(padKey);
        };

        padsBox.appendChild(padButton);
    }
}

drawPads();

function pressPad(pressedKey) {
    pressedKey = pressedKey.toLowerCase();

    if (padsData[pressedKey]) {
        let selectedPad = padsData[pressedKey];
        playSound(selectedPad.soundType);

        selectedPad.count++;

        statusLabel.innerHTML = `Now Playing: ${selectedPad.title}`;
    }

    drawPads();

    const padElement = document.getElementById(`pad-${pressedKey}`);

    if (padElement) {
        padElement.classList.add("active");
        setTimeout(() => padElement.classList.remove("active"), 150);
    }
}

function deleteSample() {
  const deleteField = document.getElementById("deleteKeyInput");
  const keyToDelete = deleteField.value.trim().toLowerCase();

  if (!keyToDelete) {
    alert("Будь ласка, введіть клавішу для видалення!");
    return;
  }

  if (keyToDelete in padsData) {
    delete padsData[keyToDelete];
    drawPads();
    deleteField.value = "";
  } 
  
  else {
    alert(`Клавішу "${keyToDelete}" не знайдено в пульті!`);
  }
}

window.addEventListener("keydown", (keyEvent) => {
    if(keyEvent.target.tagName === 'INPUT' || keyEvent.target.tagName === 'SELECT'){
        return;
    }

    pressPad(keyEvent.key);
})

document.getElementById("addBtn").onclick = function() {
    const keyField = document.getElementById("inputKey");
    const nameField = document.getElementById("inputName");
    const typeField = document.getElementById("inputType");

    const keyText = keyField.value.trim().toLowerCase();
    const nameText = nameField.value.trim();
    const typeText = typeField.value.trim();

    if(keyText !== '' && nameText !== '') {
        padsData[keyText] = { title: nameText, soundType: typeText, count: 0 };
        keyField.value = '';
        nameField.value = '';
        drawPads();
    }
    else {
        alert("Заповніть всі поля!");
    }
}