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