const checkCurrency = document.getElementById('dolar')

// const getChange = async () => {
//     const resp = await fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
//     const data = await resp.json()

//     console.log(data)
// };

fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
    .then(resp => resp.json())
    .then(data => {

        data.forEach(data => {
            const li = document.createElement('li')
            li.innerHTML = `
            <h3>${data.casa.nombre}</h3>
            <p>Compra: $${data.casa.compra}</p>
            <p>Venta:  ${data.casa.venta}</p>
            `
            checkCurrency.appendChild(li)
        })
    });

