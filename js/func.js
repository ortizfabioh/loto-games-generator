function sendData() {
    var el = document.getElementById("data");
    if(typeof(el) != 'undefined' && el != null) {
        el.parentNode.removeChild(el);
        document.getElementById("tabela").style.display = "none";
        var new_tbody = document.createElement('tbody');
        var old_tbody = document.getElementsByTagName("tbody")[0];
        old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
    }
    
    var v = document.getElementById("qtd").value;
    var div = document.getElementById("inputs");
    var br = document.createElement("br");
    
    var form = document.createElement("form");
    form.appendChild(br);
    form.setAttribute("method", "post");
    form.setAttribute("id", "data");

    for(let i=0; i<v; i++) {
        let u=i+1;
        var input = document.createElement("input");
        input.setAttribute("type", "number");
        input.setAttribute("placeholder", "valor "+u);
        input.setAttribute("required", "");
        input.setAttribute("value", u);  // Coloca valor pré definido
        
        form.appendChild(input);
    }
    
    form.appendChild(br.cloneNode());
    form.appendChild(br.cloneNode());
    var chk1 = document.createElement("input");
    chk1.setAttribute("type", "checkbox");
    chk1.setAttribute("id", "chk1");
    chk1.setAttribute("name", "restrictions");
    chk1.setAttribute("value", "seqValues");
    chk1.setAttribute("onclick", "uncheckOthers()");
    chk1.setAttribute("checked", "");
    var label1 = document.createElement("label");
    label1.setAttribute("for", "chk1");
    label1.innerHTML = " Remover jogos com <strong>3</strong> valores seguidos";
    form.appendChild(chk1);
    form.appendChild(label1);

    form.appendChild(br.cloneNode());
    var chk2 = document.createElement("input");
    chk2.setAttribute("type", "checkbox");
    chk2.setAttribute("id", "chk2");
    chk2.setAttribute("name", "restrictions");
    chk2.setAttribute("value", "oddEvenValues");
    chk2.setAttribute("onclick", "uncheckOthers()");
    chk2.setAttribute("checked", "");
    var label3 = document.createElement("label");
    label3.setAttribute("for", "chk2");
    label3.innerHTML = " Remover jogos com todos valores pares/ímpares";
    form.appendChild(chk2);
    form.appendChild(label3);

    form.appendChild(br.cloneNode());
    var chk3 = document.createElement("input");
    chk3.setAttribute("type", "checkbox");
    chk3.setAttribute("id", "chk3");
    chk3.setAttribute("name", "restrictions");
    chk3.setAttribute("value", "all");
    chk3.setAttribute("onclick", "uncheckOthers()");
    var label3 = document.createElement("label");
    label3.setAttribute("for", "chk3");
    label3.innerHTML = " Listar todos os jogos";
    form.appendChild(chk3);
    form.appendChild(label3);

    form.appendChild(br.cloneNode());
    form.appendChild(br.cloneNode());
    var btn = document.createElement("input");
    btn.setAttribute("type", "button");
    btn.setAttribute("onclick", "getValuesFromInputs()");
    btn.setAttribute("value", "Confirmar números");
    form.appendChild(btn);

    div.appendChild(form);
}

function getValuesFromInputs() {
    // Apagar tabela
    document.getElementById("tabela").style.display = "none";
    var new_tbody = document.createElement('tbody');
    var old_tbody = document.getElementsByTagName("tbody")[0];
    old_tbody.parentNode.replaceChild(new_tbody, old_tbody);

    let arr = [];
    var v = document.getElementById("qtd").value;
    var n = parseInt(document.getElementById("lotoType").value);
    let a = 3;
    
    for(let i=0; i<v; i++) {
        let n = parseInt(document.getElementsByTagName("input")[a].value);
        if(!arr.includes(n)) {
            arr[i] = n;
            a++;
        }
    }

    if(arr.length == v) {
        calc(arr, n);  // param de tamanho do jogo
    } else {
        alert("Existem 2 ou mais campos com o mesmo valor!");
    }
}

function calc(arr, tamanhoJogo) {
    function* combinations(n, k) {  // Gera combinações de índices
        if(k < 1) {
            yield [];
        } else {
            for(let i=k; i<=n; i++) {
                for(let tail of combinations(i-1, k-1)) {
                    tail.push(i);
                    yield tail;
                }
            } 
        }
    }
    
    /****** RESTRIÇÕES ******/
    function checkSequences(arr) {  // Checa se o jogo possui alguma sequência de 3 valores seguidos
        for(let i=0; i<(arr.length-2); i++) {
            if(arr[i+1] == arr[i]+1 && arr[i+2] == arr[i]+2){
                return true
            }
        }
        return false
    }

    function checkOddEven(arr) {  // Checa se o jogo contém só pares ou só ímpares
        return arr.every((el) => el%2==0) || arr.every((el) => el%2==1);
    }
    /****** //RESTRIÇÕES ******/
    
    var chk1 = document.getElementById("chk1").checked;
    var chk2 = document.getElementById("chk2").checked;
    var chk3 = document.getElementById("chk3").checked;
    
    let result = [];
    // Transcreve o array de índices para os valores do usuário
    for(let combination of combinations(arr.length, tamanhoJogo)) {
        let temp = [];
        for(let i=0; i<combination.length; i++) {
            temp[i] = arr[combination[i]-1];
        }

        temp.sort((a, b) => a-b);
        if(chk3) {
            result.push(temp);
        }
        if(chk1 || chk2) {
            if(chk1) {
                if(checkSequences(temp)) {
                    continue;
                }
            }
            if(chk2) {
                if(checkOddEven(temp)) {
                    continue;
                }
            }
            result.push(temp);
        }
    }
    result.sort(function(a, b) { return (a[0] === b[0]) ? ((a[1] === b[1]) ? a[2]-b[2] : a[1]-b[1]) : a[0]-b[0]; });

    table(result, result.length, result.length*Math.abs(document.getElementById("preco").value));
}

function table(array, total, totalPrice) {
    var tbody = document.getElementById("tabela").getElementsByTagName("tbody")[0];
    document.getElementById("tabela").style.display = "block";
    
    document.getElementById("qtde").innerHTML = "Quantidade total de jogos: "+total;
    document.getElementById("precoTotal").innerHTML = "Preço total: "+totalPrice;
    
    for(let i=total; i>0; i--) {
        var row = tbody.insertRow(0);
        var cell1 = row.insertCell(0);
        cell1.innerHTML = "<strong>"+i+"</strong>";
        var cell2 = row.insertCell(1);
        cell2.innerHTML = array[i-1];
        var cell3 = row.insertCell(2);
        cell3.innerHTML = "<form><input type='checkbox'></form>";  
    }

    tabela.appendChild(tbody);
}

function uncheckOthers() {
    chk1 = document.getElementById("chk1");
    chk2 = document.getElementById("chk2");
    chk3 = document.getElementById("chk3");
    if(chk3.checked) {
        chk1.checked = false;
        chk2.checked = false;
    }
    if(chk1.checked || chk2.checked) {
        chk3.checked = false;
    }
}