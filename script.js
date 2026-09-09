// Sayfa yüklendiğinde hafızadaki görevleri getir
document.addEventListener("DOMContentLoaded", gorevleriYukle);

function elemanEkle() {
    var input = document.getElementById("todoInput");
    var metin = input.value.trim();

    if (metin !== "") {
        gorevArayuzEkle(metin, false);
        input.value = "";
        hafizayiGuncelle();
        sayaciGuncelle();
    } else {
        // Boş input uyarısı
        uyariGoster("Lütfen geçerli bir görev metni girin!");
    }
}

// Şık Uyarı Mesajı Oluşturan Fonksiyon
function uyariGoster(mesaj) {
    // Varsa eski uyarıyı kaldır
    var eskiUyari = document.querySelector(".custom-alert");
    if (eskiUyari) eskiUyari.remove();

    var alertBox = document.createElement("div");
    alertBox.className = "custom-alert";
    alertBox.textContent = mesaj;

    document.body.appendChild(alertBox);

    // 2.5 saniye sonra ekrandan yumuşakça kaldır
    setTimeout(function() {
        alertBox.classList.add("hide");
        setTimeout(function() {
            alertBox.remove();
        }, 300);
    }, 2500);
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
   // Sil İkonu (Buton İşlevi Gören Mavi Silgi İkonu)
    var deleteBtn = document.createElement("span");
    deleteBtn.className = "delete-icon";
    deleteBtn.title = "Sil";
    deleteBtn.role = "button";
    // Sil İkonu (Mavi Renkli Silgi Görünümü)
    var deleteBtn = document.createElement("span");
    deleteBtn.className = "delete-icon";
    deleteBtn.title = "Sil";
    deleteBtn.role = "button";
    deleteBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Mavi Silgi Gövdesi -->
            <rect x="5" y="7" width="14" height="10" rx="2" fill="#0088CC"/>
            <!-- Karton / Kuşak Kısım (Açık Mavi) -->
            <rect x="5" y="7" width="6" height="10" rx="1" fill="#4DB6AC"/>
            <!-- Detay Çizgisi -->
            <line x1="11" y1="7" x2="11" y2="17" stroke="#005580" stroke-width="1"/>
            <!-- Silgi Köşe Parlaması -->
            <path d="M6 8H18" stroke="#E0F7FA" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
        </svg>
    `;
    deleteBtn.onclick = function() {
        li.remove();
        hafizayiGuncelle();
    };

    // İkonları gruba, grubu ve sol içeriği de liste elemanına (li) ekle
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    li.appendChild(leftDiv);
    li.appendChild(btnGroup);

    ul.appendChild(li);
} // gorevArayuzEkle fonksiyonunun kapanışı

// Tümünü Sil Fonksiyonu (Ekrani ve LocalStorage'i Ayni Anda Temizler)
function tumunuSil() {
    var ul = document.getElementById("todoList");
    ul.innerHTML = "";
    localStorage.removeItem("gorevler");
    hafizayiGuncelle();
    sayaciGuncelle(); // Tüm silme işleminden sonra sayacı sıfırlar
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
    
    // Sayacı her veri değişiminde çalıştır
    sayaciGuncelle(); 
}

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
    sayaciGuncelle(); // Sayfa yüklendiğinde sayacı çalıştırır
}
// Enter tuşuna basıldığında ekleme işlemini tetikle
document.getElementById("todoInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        elemanEkle();
    }
});

// Görev Sayısını Güncelleyen Yardımcı Fonksiyon
function sayaciGuncelle() {
    var toplam = document.querySelectorAll("#todoList li").length;
    var counterElement = document.getElementById("counter");
    if (counterElement) {
        counterElement.textContent = "Toplam Görev: " + toplam;
    }
}