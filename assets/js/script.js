// Format amount with commas (1000000 → 1,000,000)
const mortgageAmountInput = document.getElementById('mortgage-amount');

mortgageAmountInput.addEventListener('input', e => {
  let value = e.target.value.replace(/[^0-9.]/g, '');
  let parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  e.target.value = parts.join('.');
});

// Logic for validation, errors, and calculations
const calcButton = document.querySelector('.calc-button');

const amountInput = document.getElementById('mortgage-amount');
const amountInputIcon = document.getElementById('icon-amount');

const yearsInput = document.getElementById('mortgage-years');
const yearsInputIcon = document.getElementById('icon-years');

const rateInput = document.getElementById('mortgage-rate');
const rateInputIcon = document.getElementById('icon-rate');

const typeInputs = document.getElementsByName('mortgage-type');

const monthlyEl = document.getElementById('monthly-payment');
const totalEl = document.getElementById('total-repayment');

const errorMessageAmount = document.getElementById('error-message-amount');
const errorMessageYears = document.getElementById('error-message-years');
const errorMessageRate = document.getElementById('error-message-rate');
const errorMessageRadio = document.getElementById('error-message-radio');

calcButton.addEventListener('click', () => {
  // Clear all errors and error styles before validation
  amountInput.classList.remove('input-error');
  amountInput.parentElement.classList.remove('input-error');
  amountInputIcon.classList.remove('input-icon-error');
  errorMessageAmount.style.display = 'none';

  yearsInput.classList.remove('input-error');
  yearsInput.parentElement.classList.remove('input-error');
  yearsInputIcon.classList.remove('input-icon-error');
  errorMessageYears.style.display = 'none';

  rateInput.classList.remove('input-error');
  rateInput.parentElement.classList.remove('input-error');
  rateInputIcon.classList.remove('input-icon-error');
  errorMessageRate.style.display = 'none';

  errorMessageRadio.style.display = 'none';

  // Extract values, removing commas from amount
  const principal = parseFloat(amountInput.value.replace(/,/g, ''));
  const years = parseFloat(yearsInput.value);
  const rate = parseFloat(rateInput.value);

  let valid = true;

  if (isNaN(principal) || principal <= 0) {
    amountInput.classList.add('input-error');
    amountInput.parentElement.classList.add('input-error');
    amountInputIcon.classList.add('input-icon-error');
    errorMessageAmount.style.display = 'block';
    valid = false;
  }

  if (isNaN(years) || years <= 0) {
    yearsInput.classList.add('input-error');
    yearsInput.parentElement.classList.add('input-error');
    yearsInputIcon.classList.add('input-icon-error');
    errorMessageYears.style.display = 'block';
    valid = false;
  }

  if (isNaN(rate) || rate < 0) {
    rateInput.classList.add('input-error');
    rateInput.parentElement.classList.add('input-error');
    rateInputIcon.classList.add('input-icon-error');
    errorMessageRate.style.display = 'flex';
    valid = false;
  }

  const selectedRadio = [...typeInputs].find(r => r.checked);
  if (!selectedRadio) {
    errorMessageRadio.style.display = 'block';
    valid = false;
  }

  if (!valid) {
    document.querySelector('.mortgage-calculator').classList.add('error-visible');
    return; // do not proceed with calculation if there are errors
  } else {
    document.querySelector('.mortgage-calculator').classList.remove('error-visible');
  }

  // Determine mortgage type and calculate payments
  const selectedType = selectedRadio.value;
  const months = years * 12;
  const monthlyRate = rate / 12 / 100;

  let monthlyPayment = 0;
  let totalRepayment = 0;

  if (selectedType === 'repayment') {
    if (monthlyRate === 0) {
      monthlyPayment = principal / months;
    } else {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    }
    totalRepayment = monthlyPayment * months;
  } else if (selectedType === 'interest-only') {
    monthlyPayment = principal * monthlyRate;
    totalRepayment = monthlyPayment * months + principal;
  }

  // Display results with formatting
  monthlyEl.textContent = '£' + monthlyPayment.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  totalEl.textContent = '£' + totalRepayment.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Show the results block
  document.querySelector('.title-right').style.display = 'flex';
  document.querySelector('.right-text').style.display = 'flex';
  document.querySelector('.right-card').style.display = 'flex';
  document.querySelector('.right-placeholder').style.display = 'none';
});

// Logic for Clear button (reset)
const clearButton = document.querySelector('.clear');

clearButton.addEventListener('click', () => {
  amountInput.value = '';
  yearsInput.value = '';
  rateInput.value = '';
  monthlyEl.textContent = '£0';
  totalEl.textContent = '£0';

  document.querySelector('.title-right').style.display = 'none';
  document.querySelector('.right-text').style.display = 'none';
  document.querySelector('.right-card').style.display = 'none';
  document.querySelector('.right-placeholder').style.display = 'flex';

  typeInputs.forEach(radio => {
    radio.checked = false;
  });

  amountInput.classList.remove('input-error');
  amountInput.parentElement.classList.remove('input-error');
  amountInputIcon.classList.remove('input-icon-error');

  yearsInput.classList.remove('input-error');
  yearsInput.parentElement.classList.remove('input-error');
  yearsInputIcon.classList.remove('input-icon-error');

  rateInput.classList.remove('input-error');
  rateInput.parentElement.classList.remove('input-error');
  rateInputIcon.classList.remove('input-icon-error');

  errorMessageAmount.style.display = 'none';
  errorMessageYears.style.display = 'none';
  errorMessageRate.style.display = 'none';
  errorMessageRadio.style.display = 'none';

  document.querySelector('.mortgage-calculator').classList.remove('error-visible');
});