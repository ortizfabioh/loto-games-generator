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
    var radio1 = document.createElement("input");
    radio1.setAttribute("type", "radio");
    radio1.setAttribute("id", "radio1");
    radio1.setAttribute("name", "number");
    radio1.setAttribute("value", "3");
    radio1.setAttribute("checked", "");
    var label1 = document.createElement("label");
    label1.setAttribute("for", "radio1");
    label1.innerHTML = "Remover jogos com <strong>3</strong> valores iguais";
    form.appendChild(radio1);
    form.appendChild(label1);
    
    form.appendChild(br.cloneNode());
    var radio2 = document.createElement("input");
    radio2.setAttribute("type", "radio");
    radio2.setAttribute("id", "radio2");
    radio2.setAttribute("name", "number");
    radio2.setAttribute("value", "4");
    var label2 = document.createElement("label");
    label2.setAttribute("for", "radio2");
    label2.innerHTML = "Remover jogos com <strong>4</strong> valores iguais";
    form.appendChild(radio2);
    form.appendChild(label2);

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
    let a = 3;
    
    for(let i=0; i<v; i++) {
        let n = parseInt(document.getElementsByTagName("input")[a].value);
        if(!arr.includes(n)) {
            arr[i] = n;
            a++;
        }
    }

    if(arr.length == v) {
        calc(arr, 5);  // param de tamanho do jogo
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
    function checkDuplicates(result, arr, n) {  // Identificar jogos q tenham n valores iguais
        let duplicate = false;
        for(let item of result) {  // Isola cada array do result
            let c=0;
            for(let i=0; i<arr.length; i++) {
                if(item.includes(arr[i])) {
                    if(++c == n) {
                        duplicate = true;  // é duplicado
                        break;
                    }
                }
            }
        }
        return duplicate;
    }
    /****** //RESTRIÇÕES ******/
    
    var radioChecked = document.getElementsByName("number");
    let n;
    for(let i=0; i<radioChecked.length; i++) {
        if(radioChecked[i].checked) { n = parseInt(radioChecked[i].value); }
    }
    
    let result = [];
    // Transcreve o array de índices para os valores do usuário
    for(let combination of combinations(arr.length, tamanhoJogo)) {
        let temp = [];
        for(let i=0; i<combination.length; i++) {
            temp[i] = arr[combination[i]-1];
        }
        if(!checkDuplicates(result, temp, n)) {  // Remover jogos com n valores iguais
            temp.sort((a, b) => a-b);
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