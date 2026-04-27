// Senarai perkataan untuk Passphrase
const wordList = ["Apple", "Baker", "Coffee", "Donut", "Echo", "Forest", "Garden", "Honey", "Island", "Jungle", "Kite", "Lemon", "Mountain", "Night", "Ocean", "Piano", "Quiet", "River", "Sunset", "Tiger", "Umbrella", "Valley", "Winter", "Xylophone", "Yellow", "Zebra", "Breeze", "Cloud", "Dancer", "Eagle", "Flame", "Glory", "Harmony", "Indigo", "Joy", "Kind", "Lunar", "Mist", "Noble", "Orchid", "Purity", "Quartz", "Radiant", "Silver", "Trust", "Unique", "Vivid", "Wisdom", "Zenith"];

// DOM Elements - Utama
const display = document.getElementById("password-display");
const slider = document.getElementById("length-slider");
const lengthVal = document.getElementById("length-val");
const sliderLabel = document.getElementById("slider-label");
const customInput = document.getElementById("custom-input");

// DOM Elements - Modal & Card
const modal = document.getElementById("qr-modal");
const qrBtn = document.getElementById("qr-btn");
const closeModal = document.getElementById("close-modal");
const accountInput = document.getElementById("account-name");
const usernameInput = document.getElementById("username-input");
const displayDateTime = document.getElementById("display-datetime");
const saveImgBtn = document.getElementById("save-img-btn");

// Inisialisasi QRious (Library QR)
const qr = new QRious({
    element: document.getElementById('qr-canvas'),
    size: 250,
    level: 'H' // High error correction
});

// =========================================
// LOGIK PEMBANTU (HELPERS)
// =========================================

// Fungsi jana format tarikh: W[Minggu]-Rabu-2April2026-2.30 pm
function getFormattedDate() {
    const now = new Date();
    const days = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
    const months = ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"];
    
    const dayName = days[now.getDay()];
    const date = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();
    
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;

    const weekNum = Math.ceil(date / 7);
    
    return `W${weekNum}-${dayName}-${date} ${monthName} ${year}-${hours}.${minutes} ${ampm}`;
}

// =========================================
// LOGIK PENJANAAN (CORE)
// =========================================

// Tukar Mod (Password vs Passphrase vs Custom)
document.getElementsByName("mode").forEach(radio => {
    radio.onchange = () => {
        const mode = radio.value;
        const isPassword = mode === "password";
        const isPassphrase = mode === "passphrase";
        const isCustom = mode === "custom";

        document.getElementById("password-options").classList.toggle("hidden", !isPassword);
        document.getElementById("passphrase-options").classList.toggle("hidden", !isPassphrase);
        document.getElementById("custom-options").classList.toggle("hidden", !isCustom);
        
        if (isCustom) {
            document.querySelector(".slider-section").classList.add("hidden");
            document.getElementById("regen-btn").classList.add("hidden");
            generate();
        } else {
            document.querySelector(".slider-section").classList.remove("hidden");
            document.getElementById("regen-btn").classList.remove("hidden");
            if (isPassphrase) {
                sliderLabel.innerText = "Words";
                slider.min = 3; slider.max = 20; slider.value = 6;
            } else {
                sliderLabel.innerText = "Characters";
                slider.min = 8; slider.max = 128; slider.value = 16;
            }
            lengthVal.innerText = slider.value;
            generate();
        }
    };
});

slider.oninput = () => {
    lengthVal.innerText = slider.value;
    generate();
};

function generate() {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    if (mode === "passphrase") generatePassphrase();
    else if (mode === "password") generatePassword();
    else if (mode === "custom") generateCustom();
}

function generateCustom() {
    const val = customInput.value;
    if (!val) {
        display.innerHTML = "<span style='color:red'>Enter your password</span>";
        document.getElementById("strength-txt").innerText = "-";
        document.getElementById("crack-time").innerText = "-";
    } else {
        renderResult(val);
    }
}

// Event listener for custom input
customInput.addEventListener('input', generateCustom);

function generatePassword() {
    const chars = {
        u: "ABCDEFGHJKLMNPQRSTUVWXYZ",
        l: "abcdefghijkmnopqrstuvwxyz",
        n: "23456789",
        s: "!@#$%^&*()-_=+[]{}"
    };
    let pool = "";
    if (document.getElementById("upper").checked) pool += chars.u;
    if (document.getElementById("lower").checked) pool += chars.l;
    if (document.getElementById("numbers").checked) pool += chars.n;
    if (document.getElementById("symbols").checked) pool += chars.s;

    if (!pool) return display.innerHTML = "<span style='color:red'>Select an option</span>";

    let result = "";
    const length = parseInt(slider.value);
    for (let i = 0; i < length; i++) {
        result += pool[window.crypto.getRandomValues(new Uint32Array(1))[0] % pool.length];
    }
    renderResult(result);
}

function generatePassphrase() {
    const numWords = parseInt(slider.value);
    const sep = document.getElementById("separator").value || "-";
    const capitalize = document.getElementById("capitalize").checked;
    const includeNum = document.getElementById("include-num").checked;
    
    let words = [];
    for (let i = 0; i < numWords; i++) {
        let word = wordList[window.crypto.getRandomValues(new Uint32Array(1))[0] % wordList.length];
        if (!capitalize) word = word.toLowerCase();
        if (includeNum) word += Math.floor(Math.random() * 10);
        words.push(word);
    }
    renderResult(words.join(sep), sep);
}

function renderResult(str, sep = null) {
    display.innerHTML = "";
    str.split("").forEach(char => {
        const span = document.createElement("span");
        if (/[0-9]/.test(char)) span.className = "char-num";
        else if (char === sep || /[!@#$%^&*()-_=+[]{}]/.test(char)) span.className = "char-sym";
        else span.className = "char-text";
        span.innerText = char;
        display.appendChild(span);
    });
    updateMeta(str);
}

function updateMeta(str) {
    const strength = document.getElementById("strength-txt");
    const crack = document.getElementById("crack-time");
    if (str.length < 12) { strength.innerText = "Weak"; crack.innerText = "Seconds"; }
    else if (str.length < 24) { strength.innerText = "Good"; crack.innerText = "Years"; }
    else { strength.innerText = "Strong"; crack.innerText = "Centuries"; }
}

// =========================================
// UI EVENT LISTENERS
// =========================================

// Fungsi Copy ke Clipboard (Kini menggunakan EMOJI untuk mod Offline)
document.getElementById("copy-btn").onclick = () => {
    const textToCopy = display.innerText;
    if (!textToCopy || textToCopy === "Select an option" || textToCopy === "Enter your password") return;
    navigator.clipboard.writeText(textToCopy);
    
    const btn = document.getElementById("copy-btn");
    
    btn.innerHTML = '✅ Copied!'; 
    setTimeout(() => {
        btn.innerHTML = '📋 Copy'; 
    }, 2000);
};

document.getElementById("regen-btn").onclick = generate;

// Buka Modal QR
qrBtn.onclick = () => {
    const currentPwd = display.innerText;
    if (!currentPwd || currentPwd === "Select an option" || currentPwd === "Enter your password") return;
    
    qr.value = currentPwd;
    displayDateTime.innerText = getFormattedDate();
    accountInput.value = ""; 
    usernameInput.value = "";
    
    modal.classList.remove("hidden");
};

// Simpan Kad QR sebagai Gambar (PNG)
saveImgBtn.onclick = async () => {
    const cardArea = document.getElementById("qr-card-area");
    
    try {
        const canvas = await html2canvas(cardArea, {
            backgroundColor: "#FFFFFF",
            scale: 2, 
            logging: false,
            useCORS: true
        });

        const fileName = (accountInput.value.replace(/\s+/g, '_') || "CoffeePass") + "_QR.png";

        // Jika dalam Capacitor native (Android/iOS)
        if (window.Capacitor && window.Capacitor.isNativePlatform()) {
            const base64Data = canvas.toDataURL("image/png").split(',')[1];
            const { Filesystem } = window.Capacitor.Plugins;
            
            await Filesystem.writeFile({
                path: "CoffeePassGen/" + fileName,
                data: base64Data,
                directory: "DOCUMENTS",
                recursive: true
            });

            // Cuba juga simpan ke Downloads supaya senang jumpa
            try {
                await Filesystem.writeFile({
                    path: "Download/" + fileName,
                    data: base64Data,
                    directory: "EXTERNAL_STORAGE",
                    recursive: true
                });
            } catch (e) {
                // Abaikan jika tak dapat simpan ke Downloads (permission)
                console.log("Could not save to Downloads:", e);
            }
            
            alert("✅ Card saved!\n📁 Location: Documents/CoffeePassGen/" + fileName);
        } else {
            // Browser fallback / PWA Mobile
            const dataUrl = canvas.toDataURL("image/png");
            
            // Cuba gunakan Web Share API (Lebih mesra PWA untuk Android/iOS)
            if (navigator.share && navigator.canShare) {
                try {
                    const res = await fetch(dataUrl);
                    const blob = await res.blob();
                    const file = new File([blob], fileName, { type: "image/png" });
                    
                    if (navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            title: 'CoffeePass QR Card',
                            files: [file]
                        });
                        return; // Berjaya share, tamat di sini
                    }
                } catch (shareErr) {
                    console.log("Web Share dibatalkan atau gagal, guna cara biasa", shareErr);
                }
            }

            // Jika Desktop atau Web Share gagal, muat turun terus
            const link = document.createElement("a");
            link.download = fileName;
            link.href = dataUrl;
            link.click();
        }
    } catch (err) {
        console.error("Save error:", err);
        alert("❌ Gagal simpan: " + err.message);
    }
};

// Tutup Modal
closeModal.onclick = () => modal.classList.add("hidden");

window.onclick = (event) => {
    if (event.target === modal) modal.classList.add("hidden");
};

// Jalankan penjanaan kali pertama
generate();