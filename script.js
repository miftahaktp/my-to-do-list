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
    var editBtn = document.createElement("button");
    editBtn.textContent = "Düzenle";
    editBtn.className = "edit-btn";
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