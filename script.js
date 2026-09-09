document.addEventListener("DOMContentLoaded", function() {
    gorevleriYukle();
    
    // Enter tuşuna basıldığında ekleme işlemini tetikle
    var inputEl = document.getElementById("todoInput");
    if (inputEl) {
        inputEl.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                elemanEkle();
            }
        });
    }
});

function elemanEkle() {
    var input = document.getElementById("todoInput");
    var dateInput = document.getElementById("todoDate");
    var categorySelect = document.getElementById("todoCategory");

    var metin = input.value.trim();
    var tarih = dateInput ? dateInput.value : "";
    var kategori = categorySelect ? categorySelect.value : "Genel";

    if (metin !== "") {
        gorevArayuzEkle(metin, false, tarih, kategori);
        input.value = "";
        if (dateInput) dateInput.value = "";
        hafizayiGuncelle();
        sayaciGuncelle();
    } else {
        uyariGoster("Lütfen geçerli bir görev metni girin!");
    }
}

function gorevArayuzEkle(metin, tamamlandiMi, tarih, kategori) {
    var ul = document.getElementById("todoList");
    var li = document.createElement("li");

    // Sol Kısım
    var leftDiv = document.createElement("div");
    leftDiv.className = "left-content";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tamamlandiMi;

    var span = document.createElement("span");
    span.textContent = metin;
    if (tamamlandiMi) span.classList.add("completed");

    checkbox.onclick = function() {
        if (checkbox.checked) {
            span.classList.add("completed");
        } else {
            span.classList.remove("completed");
        }
        hafizayiGuncelle();
    };

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(span);

    // Kategori Rozeti (Badge)
    if (kategori) {
        var categoryBadge = document.createElement("span");
        categoryBadge.className = "badge badge-" + kategori.toLowerCase();
        categoryBadge.textContent = kategori;
        leftDiv.appendChild(categoryBadge);
    }

    // Tarih Bilgisi
    if (tarih) {
        var dateSpan = document.createElement("span");
        dateSpan.className = "task-date";
        dateSpan.textContent = "(" + tarih + ")";
        
        var bugun = new Date().toISOString().split('T')[0];
        if (tarih < bugun && !tamamlandiMi) {
            dateSpan.classList.add("expired");
        }
        leftDiv.appendChild(dateSpan);
    }

    // Sağ Kısım - Orijinal İkon Stilleriniz (SVG)
    var btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";

    var editBtn = document.createElement("span");
    editBtn.className = "edit-icon";
    editBtn.title = "Düzenle";
    editBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.84 2.73a2.5 2.5 0 0 1 3.53 0l.9.9a2.5 2.5 0 0 1 0 3.53L8.85 19.58l-4.57 1.14a1 1 0 0 1-1.22-1.22l1.14-4.57L16.84 2.73z" fill="#ff9800"/><path d="M16.84 2.73l2.83 2.83" stroke="#e65100" stroke-width="1.5" stroke-linecap="round"/><path d="M18.37 4.26a2.5 2.5 0 0 0-3.53 0L17 6.41a2.5 2.5 0 0 0 1.37-2.15z" fill="#ffb74d"/><path d="M3.06 19.5a.5.5 0 0 0 .61.61l2.42-.6-2.43-2.43-.6 2.42z" fill="#37474f"/></svg>`;
    editBtn.onclick = function() {
        var yeniMetin = prompt("Görevi düzenleyin:", span.textContent);
        if (yeniMetin !== null && yeniMetin.trim() !== "") {
            span.textContent = yeniMetin.trim();
            hafizayiGuncelle();
        }
    };

    var deleteBtn = document.createElement("span");
    deleteBtn.className = "delete-icon";
    deleteBtn.title = "Sil";
    deleteBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="7" width="14" height="10" rx="2" fill="#0088CC"/><rect x="5" y="7" width="6" height="10" rx="1" fill="#4DB6AC"/><line x1="11" y1="7" x2="11" y2="17" stroke="#005580" stroke-width="1"/></svg>`;
    deleteBtn.onclick = function() {
        li.remove();
        hafizayiGuncelle();
        sayaciGuncelle();
    };

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    li.appendChild(leftDiv);
    li.appendChild(btnGroup);
    ul.appendChild(li);
}

// Filtreleme Fonksiyonu
function filtrele(durum, buton) {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    buton.classList.add("active");

    var liElemanlari = document.querySelectorAll("#todoList li");
    liElemanlari.forEach(function(li) {
        var checkbox = li.querySelector("input[type='checkbox']");
        var tamamlandiMi = checkbox ? checkbox.checked : false;
        
        if (durum === "hepsi") {
            li.style.display = "flex";
        } else if (durum === "tamamlanan" && tamamlandiMi) {
            li.style.display = "flex";
        } else if (durum === "bekleyen" && !tamamlandiMi) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }
    });
}

// LocalStorage Güncelleme
function hafizayiGuncelle() {
    var gorevler = [];
    document.querySelectorAll("#todoList li").forEach(function(li) {
        var spanEl = li.querySelector(".left-content span:not(.badge):not(.task-date)");
        var metin = spanEl ? spanEl.textContent : "";
        
        var checkbox = li.querySelector("input[type='checkbox']");
        var tamamlandiMi = checkbox ? checkbox.checked : false;
        
        var badgeEl = li.querySelector(".badge");
        var kategori = badgeEl ? badgeEl.textContent : "Genel";
        
        var dateEl = li.querySelector(".task-date");
        var tarih = dateEl ? dateEl.textContent.replace("(", "").replace(")", "") : "";

        if (metin !== "") {
            gorevler.push({ metin: metin, tamamlandi: tamamlandiMi, tarih: tarih, kategori: kategori });
        }
    });
    localStorage.setItem("gorevler", JSON.stringify(gorevler));
    sayaciGuncelle();
}

// Görevleri Yükleme
function gorevleriYukle() {
    var kaydedilenler = localStorage.getItem("gorevler");
    if (kaydedilenler) {
        var gorevler = JSON.parse(kaydedilenler);
        gorevler.forEach(function(g) {
            gorevArayuzEkle(g.metin, g.tamamlandi, g.tarih, g.kategori);
        });
    }
    sayaciGuncelle();
}

// Tümünü Sil
function tumunuSil() {
    document.getElementById("todoList").innerHTML = "";
    localStorage.removeItem("gorevler");
    sayaciGuncelle();
}

// Canlı Sayaç
function sayaciGuncelle() {
    var toplam = document.querySelectorAll("#todoList li").length;
    var counterElement = document.getElementById("counter");
    if (counterElement) counterElement.textContent = "Toplam Görev: " + toplam;
}

// Şık Uyarı Kutusu
function uyariGoster(mesaj) {
    var eski = document.querySelector(".custom-alert");
    if (eski) eski.remove();

    var alertBox = document.createElement("div");
    alertBox.className = "custom-alert";
    alertBox.textContent = mesaj;
    document.body.appendChild(alertBox);

    setTimeout(function() {
        alertBox.classList.add("hide");
        setTimeout(function() { alertBox.remove(); }, 300);
    }, 2500);
}