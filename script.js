function elemanEkle() {
    var input = document.getElementById("todoInput");
    var metin = input.value;

    if (metin !== "") {
        var ul = document.getElementById("todoList");
        var li = document.createElement("li");
        li.textContent = metin;
        ul.appendChild(li);
        input.value = "";
    }
}
function elemanEkle() {
    var input = document.getElementById("todoInput");
    var metin = input.value;

    if (metin !== "") {
        var ul = document.getElementById("todoList");
        var li = document.createElement("li");

        // Sol Kısım (Onay Kutusu ve Metin)
        var leftDiv = document.createElement("div");
        leftDiv.className = "left-content";

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        
        var span = document.createElement("span");
        span.textContent = metin;

        // Onay kutusu işaretlendiğinde metnin üstünü çiz
        checkbox.onclick = function() {
            if (checkbox.checked) {
                span.classList.add("completed");
            } else {
                span.classList.remove("completed");
            }
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
                span.textContent = yeniMetin;
            }
        };

        // Sil Butonu
        var deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Sil";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = function() {
            li.remove();
        };

        btnGroup.appendChild(editBtn);
        btnGroup.appendChild(deleteBtn);

        // Elemanları li içine ekle
        li.appendChild(leftDiv);
        li.appendChild(btnGroup);

        ul.appendChild(li);
        input.value = "";
    }
}