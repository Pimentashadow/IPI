function codigo(){

    var res = document.getElementById('res');

    var n =  Math.floor(Math.random() * 999999999999 + 100000000000 ) //função para gerar o valor do rupi

    // let n2 = Number(n)

    res.innerHTML = ``
    res.innerHTML = `${Number(n)}`
}

