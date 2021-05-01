'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// BANKKIST APP
const displayMovements = function (
  movements,
  sort = false /*array of movements*/
) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplaySummary = function (currAccount) {
  const income = currAccount.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${income}€`;

  const out = currAccount.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);

  labelSumOut.textContent = `${out}€`;

  const interest = currAccount.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * (currAccount.interestRate / 100))
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const calcDisplayBalance = function (Account) {
  Account.balance = Account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${Account.balance}€`;
};

const updateUI = function (Account) {
  //Display Movements
  displayMovements(Account.movements);
  //Display Balance
  calcDisplayBalance(Account);
  //Display Summary
  calcDisplaySummary(Account);
};
const createUserName = function (arrAccounts) {
  arrAccounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0]) // Return is happening
      .join(''); // Returns an array
  });
};
createUserName(accounts);

//Event Handlers
let currentAccount;
btnLogin.addEventListener('click', function (event) {
  event.preventDefault(); //Prevent Form From Submitting
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Clear The Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // For the field to lose its focus

    // UPDATING UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // DOING THE TRANSFER
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    // Add Movement
    currentAccount.movements.push(loanAmount);

    //Update The UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //indexof

    // Delete Account
    accounts.splice(index, 1); //Mutates the original array

    // Hide UI
    containerApp.style.opacity = 0;
  }
  // Empty The Fields
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// 141 ARRAYS METHODS
/*
let arr = ['a', 'b', 'c', 'd', 'e'];
// Slice Method wont change the original array
console.log('+++++SLICE METHOD+++++');
console.log(arr.slice(2));
console.log(arr.slice(2, 4)); // End value will not be included end - 1 element is shown length = end-start
console.log(arr.slice(-2)); //Copy from the right of the array
console.log(arr.slice(-1)); //Copy from the right of the array
console.log(arr.slice(1, -2)); //Copy from the right of the array
console.log(arr.slice()); // make a shallow copy
console.log([...arr]); // spread operator to make a shallow copy

// SPLICE METHOD, it changes the orginal array
console.log('+++++SPLICE METHOD+++++');
//console.log(arr.splice(2));
arr.splice(-1); //Delete the last element and return it
console.log(arr);

//REVERSE affects the original array
console.log('+++++REVERSE METHOD+++++');
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());

//CONCAT doesn,t affects the original array
console.log('+++++CONCAT METHOD+++++');
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]); //Spread Operator to concat two arrays

//JOIN doesn,t affects the original array
console.log('+++++JOIN METHOD+++++');
console.log(letters.join(' - '));
*/

//142
// Looping Arraysforeach
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//Using for of loop entries is a function()
console.log('+++++FOR OF LOOP+++++');
for (const [index, movement] of movements.entries()) {
  if (movement > 10) {
    console.log(`You deposited ${index}:${movement}`);
  } else {
    console.log(`You withdaw ${index}:${Math.abs(movement)}`);
  }
}
// Using for each loop, it is a higer order function it requires a call back function, each iteration it calls the function, it passes the current element of the array as argument. Can,t use break
// First Parameter is the current element
//Second is the index of the current element
// Third is the whole array
console.log('+++++FOR EACH LOOP+++++');
movements.forEach(function (movement, index, array) {
  if (movement > 10) {
    console.log(`You deposited ${index} :
    : ${movement}`);
  } else {
    console.log(`You withdaw ${index} : ${Math.abs(movement)}`);
  }
});
*/

//143 Foreach for sets and maps
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  //Key    Value
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
// First Is the value, second is the key and third is the whole map
console.log('+++++FOR EACH ON MAPS+++++');
currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});
// FOREACH ON SET
// On set key is same as value
console.log('+++++FOR EACH ON SETS+++++');
const currenciesUnique = new Set(['USD', 'EUR', 'GBP', 'USD', 'EUR']);
currenciesUnique.forEach(function (val) {
  console.log(`${val}`);
});
*/

//144 Project Bankist APP

//146 Challenge
/*
const juliaData = [3, 5, 2, 12, 7];
const katesData = [4, 1, 15, 8, 3];

const checkDogs = function (jdata, kdata) {
  const dogsJuliaCorrected = jdata.slice();
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);
  //jdata.slice(1, 3);
  const dogs = dogsJuliaCorrected.concat(kdata);
  console.log(dogs);

  dogs.forEach((dog, i) => {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult and is ${dog} years old`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy`);
    }
  });
};
checkDogs(juliaData, katesData);
*/

//147 and 148 map filter and reduce
/*
console.log('+++++MAP METHOD+++++');
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUSD = 1.1;
// Returns a new array with new elements
const movementsUSD = movements.map(mov => {
  return mov * eurToUSD;
});
console.log(movements);
console.log(movementsUSD);

const movementsDesc = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movementsDesc);
*/
// 150 filter Method
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);
*/

// 151 Reduce Method
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// accumulator is like a snowball
const globalBalance = movements.reduce(function (accumulator, element, i, arr) {
  console.log(`Iteration ${i}: ${accumulator}`);
  return accumulator + element;
}, 0);
console.log(globalBalance);

// MAX VALUE OF THE MOVEMENTS ARRAY
// Result is 3000
const max = movements.reduce((acc, mov) => {
  if (acc > mov) {
    return acc;
  } else {
    return mov;
  }
}, movements[0]);
console.log(max);
*/

// 152 Challenge
/*
const dogAges = [5, 2, 4, 1, 15, 8, 3];
const calcAverageHumanAge = function (dogsAges) {
  const humanAges = dogAges.map(function (dogAge, index) {
    if (dogAge <= 2) {
      return 2 * dogAge;
    } else if (dogAge > 2) {
      return 16 + dogAge * 4;
    }
  });

  const remainingDogsAges = humanAges.filter(function (dogAge) {
    if (dogAge >= 18) {
      return dogAge;
    }
  });

  const sumOfAllDogAges = remainingDogsAges.reduce(function (acc, dogAge) {
    return acc + dogAge;
  }, 0);

  // 2 and 3, (2+3)/2.5 === 2/2 + 2/3
  return sumOfAllDogAges / remainingDogsAges.length;
};
console.log(calcAverageHumanAge(dogAges));
*/
//153 Chaining Methods of map, filter and reduce
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUSD = 1.1;
const totalDepositsInUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUSD)
  .reduce((acc, elem) => acc + elem, 0);

console.log(totalDepositsInUSD);
*/
//154 Challene #3
/*
const dogAges = [5, 2, 4, 1, 15, 8, 3];
const calcAverageHumanAge = function (dogsAges) {
  return dogAges
    .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(dogAge => dogAge >= 18)
    .reduce((acc, dogAge, arr) => acc + dogAge / arr.length, 0);

  const humanAges = dogAges.map(function (dogAge, index) {
    if (dogAge <= 2) {
      return 2 * dogAge;
    } else if (dogAge > 2) {
      return 16 + dogAge * 4;
    }
  });

  const remainingDogsAges = humanAges.filter(function (dogAge) {
    if (dogAge >= 18) {
      return dogAge;
    }
  });

  const sumOfAllDogAges = remainingDogsAges.reduce(function (acc, dogAge) {
    return acc + dogAge;
  }, 0);

  // 2 and 3, (2+3)/2.5 === 2/2 + 2/3
  return sumOfAllDogAges / remainingDogsAges.length;
};
console.log(calcAverageHumanAge(dogAges));
*/

// 155 Find Method
// Retrun first element in the array
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const firstWithrawal = movements.find(mov => mov < 0);
console.log(firstWithrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
*/
//158 The findIndex Method
// Return the index at which the element was found
//159 Some and Every method
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

console.log('+++++INCLUDE METHOD+++++');
console.log(movements.includes(-130)); // Return Boolean, Test only for equality

console.log('+++++SOME METHOD+++++');
// Returns boolean if the condition is true. Can Specify a condition.
const anyDeposits = movements.some(mov => mov > 1500);
console.log(anyDeposits);
console.log('+++++EVERY METHOD+++++');
// Only retrun true if every element passes the test

console.log(movements.every(mov => mov > 0));

//Separate CallBack
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/

// 160 Flat and FlatMap
/*
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];

console.log('+++++FLAT METHOD+++++');
// Remove nested array and give all elements in single array. It returns a new array
console.log(arr.flat());

console.log('+++++FLAT DEEP METHOD+++++');
const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// Flat
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

// FlatMAp
console.log('+++++FLATMAP METHOD+++++');
// First Map then flatten the result. FlatMap only go 1 level deep.
const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);
*/
// 161 Sorting Arrays
// It only does on the strings
/*
const owners = ['James', 'Adam', 'Martha', 'Zack'];

// It mutates the orignal array
console.log(owners.sort());
console.log(owners);

//Numbers
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Retrun < 0 a will be before B {keep the order}
// else > 0 b will be before A {switch}
// Ascending
movements.sort((a, b) => a - b);
console.log(movements);
//Desending
movements.sort((a, b) => b - a);

console.log(movements);
*/
//162 Creating and filling arrays
// New Empty Array with 7 element
/*
const x = new Array(7);
//x.fill(1); // Mutates the original array
x.fill('1', 3, 5); // fill(what to will, from where to fill, where to end)
console.log(x);

//Array from
console.log('+++++ARRAY FROM+++++');
// USING ON THE CONSTRUCTOR
//
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    element => Number(element.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});
*/
