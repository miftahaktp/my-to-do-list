// Sayfa yüklendiğinde hafızadaki görevleri getir
document.addEventListener("DOMContentLoaded", gorevleriYukle);

function elemanEkle() {
    var input = document.getElementById("todoInput");
    var metin = input.value.trim();

    if (metin !== "") {
        gorevArayuzEkle(metin, false);
        input.value = "";
        hafizayiGuncelle();
    }
}

// Arayüze tek bir görev elemanı ekleyen yardımcı fonksiyon
function gorevArayuzEkle(metin, tamamlandiMi) {
    var ul = document.getElementById("todoList");
    var li = document.createElement("li");

    // Sol Kısım (Onay Kutusu ve Metin)
    var leftDiv = document.createElement("div");
    leftDiv.className = "left-content";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tamamlandiMi;
    
    var span = document.createElement("span");
    span.textContent = metin;

    if (tamamlandiMi) {
        span.classList.add("completed");
    }

    // Onay kutusu işaretlendiğinde
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

    // Sağ Kısım (Butonlar)
    var btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";

    // Düzenle Butonu
    // Düzenle İkonu (Buton İşlevi Gören Kalem İkonu)
    var editBtn = document.createElement("span");
    editBtn.className = "edit-icon";
    editBtn.title = "Düzenle";
    editBtn.role = "button";
    editBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Pembe Silgi -->
            <path d="M18 2L22 6L19 9L15 5L18 2Z" fill="#FF70A6"/>
            <!-- Metal Birleşim Halkası -->
            <path d="M15 5L19 9L17.5 10.5L13.5 6.5L15 5Z" fill="#D1D5DB"/>
            <!-- Turuncu Kalem Gövdesi -->
            <path d="M13.5 6.5L17.5 10.5L7.5 20.5L3.5 16.5L13.5 6.5Z" fill="#FF9800"/>
            <!-- Gövde Üzerindeki Çizgi / Detay -->
            <path d="M11.5 8.5L15.5 12.5" stroke="#E68A00" stroke-width="1"/>
            <!-- Ahşap Uç Kısım -->
            <path d="M7.5 20.5L3.5 16.5L2 22L7.5 20.5Z" fill="#FFE0B2"/>
            <!-- Kurşun Uç (Siyah) -->
            <path d="M3.2 20.8L2 22L3.2 20.8Z" fill="#1A1A1A"/>
            <path d="M2 22L3.8 20.2L3.2 19.6L2 22Z" fill="#1A1A1A"/>
        </svg>
    `;
    editBtn.onclick = function() {
        var yeniMetin = prompt("Görevi düzenleyin:", span.textContent);
        if (yeniMetin !== null && yeniMetin.trim() !== "") {
            span.textContent = yeniMetin.trim();
            hafizayiGuncelle();
        }
    };

    // Sil Butonu
    var deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Sil";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = function() {
        li.remove();
        hafizayiGuncelle();
    };

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    li.appendChild(leftDiv);
    li.appendChild(btnGroup);

    ul.appendChild(li);
}

// Tümünü Sil Fonksiyonu
function tumunuSil() {
    var ul = document.getElementById("todoList");
    ul.innerHTML = "";
    localStorage.removeItem("gorevler"); // Hafızayı temizle
}

// Ekrandaki mevcut listeyi okuyup localStorage'a kaydeder
function hafizayiGuncelle() {
    var gorevler = [];
    var liElemanlari = document.querySelectorAll("#todoList li");

    liElemanlari.forEach(function(li) {
        var metin = li.querySelector("span").textContent;
        var tamamlandiMi = li.querySelector("input[type='checkbox']").checked;
        
        gorevler.push({
            metin: metin,
            tamamlandi: tamamlandiMi
        });
    });

    localStorage.setItem("gorevler", JSON.stringify(gorevler));
}

// Sayfa yenilendiğinde localStorage'dan verileri çekip ekrana basar
function gorevleriYukle() {
    var kaydedilenler = localStorage.getItem("gorevler");
    if (kaydedilenler) {
        var gorevler = JSON.parse(kaydedilenler);
        gorevler.forEach(function(gorev) {
            gorevArayuzEkle(gorev.metin, gorev.tamamlandi);
        });
    }
}