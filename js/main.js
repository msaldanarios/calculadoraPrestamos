const form = document.getElementById('form');

const name = document.getElementById('name');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const id = document.getElementById('id');
const amount = document.getElementById('amount');
const months = document.getElementById('months');
const rate = document.getElementById('rate');
const btnEvaluate = document.getElementById('btnEvaluate');
const chartList = document.querySelector('#chart-list tbody');

const montoFinal = document.getElementById('finalAmount');
const cuotasFinales = document.getElementById('finalFees');
const intereses = document.getElementById('interests');
const totalADevolver = document.getElementById('totalAmount');


btnEvaluate.addEventListener('mouseover', (e) => {
    validateData(amount.value, rate.value, months.value);
})

const validateData = (amount, rate, months) => {
    if (amount == 0 || rate == 0 || months == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Está faltando algún dato del préstamo para la evaluación',
        })
    } else {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'success',
            title: '¡Listo para la simulación!'
          })
    }
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    getFee(amount.value, rate.value, months.value);
    getFeeLoan();
})


const getFee = (amount, rate, months) => {
    
    while (chartList.firstChild) {
        chartList.removeChild(chartList.firstChild);
    }

    let dates = [];
    let currentDate = Date.now();
    let currentMonth = moment(currentDate);
    currentMonth.add(1, 'month');

    let ratePayment = 0;
    let capitalPayment = 0;
    let fee = 0;

    fee = amount*(Math.pow(1+rate/100, months)*rate/100)/(Math.pow(1+rate/100, months)-1);


    for(let i = 1; i <= months; i++) {
        ratePayment = parseFloat(amount*(rate/100));
        capitalPayment = fee - ratePayment;
        amount = parseFloat(amount-capitalPayment);

        dates[i] = currentMonth.format('DD-MM-YYYY');
        currentMonth.add(1, 'month');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dates[i]}</td>
            <td>${fee.toFixed(2)}</td>
            <td>${capitalPayment.toFixed(2)}</td>
            <td>${ratePayment.toFixed(2)}</td>
            <td>${amount.toFixed(2)}</td>
        `;

        chartList.appendChild(row);
    }

    Swal.fire({
        icon: 'success',
        title: '¡Perfecto!',
        text: 'Tu préstamo ha sido simulado. Empezaría pagando el ' + currentMonth.format('DD-MM-YYYY'),
    });
}


/////


const getFeeLoan = () => {
    const feeLoan = rate.value * amount.value / (1 - (1+rate.value)**-months.value);
    getTotal(feeLoan)
}

const getTotal = (feeLoan) => {
    const total = feeLoan.toFixed(2) * months.value;

    const loan = {
        amount: amount.value,
        months: months.value,
        totalRate: total - amount.value,
        total: total
    }

    showLoan(loan);

    saveLoanStorage(loan);
};

const showLoan = (loan) => {
    finalAmount.innerText = `$${loan.amount}`;
    finalFees.innerText = `${loan.months}`;
    interests.innerText = `$${loan.totalRate}`;
    totalAmount.innerText = `$${loan.total}`;
};

const saveLoanStorage = (loan) => {
    localStorage.setItem('loan', JSON.stringify(loan));
};

//>>>>>Sería en caso quisiera que cuando actualice la página se mantenga el prestamo simulado

// const getLoanStorage = () => {
//     const loanStorage = JSON.parse(localStorage.getItem('loan'));
//     return loanStorage;
// };

const getLoan = () => {
    if (localStorage.getItem('loan')) {
        const loanStorage = getLoanStorage();
        showLoan(loanStorage);
    }
};

getLoan(); 