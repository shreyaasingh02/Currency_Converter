const BASE_URL = "https://open.er-api.com/v6/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

window.addEventListener("load", () => {
  updateExchangeRate();
});

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    updateExchangeRate();
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value || 1;

  const from = fromCurr.value;
  const to = toCurr.value;

  try {
    const response = await fetch(`${BASE_URL}/${from}`);
    const data = await response.json();

    if (data.result !== "success") {
      throw new Error("API failed");
    }

    const rate = data.rates[to];
    const finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${from} = ${finalAmount} ${to}`;
  } catch (err) {
    console.error(err);
    msg.innerText = "Unable to fetch exchange rate";
  }
};
