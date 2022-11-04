/*para importar os estilos css. tem que usar o script type como module para funcionar*/
import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg> g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg> g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

//para ver o path
console.log(ccBgColor01)

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

setCardType("default")

//globalThis = window - para poder reconhecer a função de maneira global
globalThis.setCardType = setCardType

const securityCode = document.getElementById("security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMask = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      /*para mostrar os dois últimos dígitos do ano*/
      from: String(new Date().getFullYear()).slice(2),
      /*para mostrar os dois últimos dígitos daqui a dez anos*/
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMask = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 000000 00000",
      regex: /^3[47]\d{0,13}/,
      cardtype: "american express",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
      cardtype: "discover",
    },
    {
      mask: "0000 000000 0000",
      regex: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
      cardtype: "diners",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 000000 00000",
      regex: /^(?:2131|1800)\d{0,11}/,
      cardtype: "jcb15",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:35\d{0,2})\d{0,12}/,
      cardtype: "jcb",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
      cardtype: "maestro",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^62\d{0,14}/,
      cardtype: "unionpay",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    console.log(foundMask)

    return foundMask
  },
}

const cardNumberMask = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  console.log("Você clicou no botão")
  //para aparecer uma mensagem no navegador
  alert("cartão adicionado")
})

document.querySelector("form").addEventListener("submit", (evento) => {
  // para o formulário não adotar o procedimento padrão quando efetua o submit
  evento.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
//input - quando a caixa de texto for receber algum tipo de dado
cardHolder.addEventListener("input", () => {
  //para acessar a classe value da classe cc-holder
  const ccHolder = document.querySelector(".cc-holder .value")

  /*
    if ternário - este nome porque possui três partes
    1ª - a condição se guida de "?" - cardHolder.value.length===0 ?
    2ª - expressão que será executada caso a afirmação seja verdadeira seguida de ":"
        "FULANO da silva" :
    3ª - expressão a ser executada caso seja falsa a afirmação
        cardHolder.value
    */
  ccHolder.innerHTML =
    cardHolder.value.length === 0 ? "FULANO da silva" : cardHolder.value
  //.length - quantidade de caracteres dentro do input
  // para mostrar no console a quantidade de caracteres adicionados
  console.log(cardHolder.value.length)
})

/*
.on - mesma lógica do event listener
accept - se atende as regras da máscara
*/

securityCodeMask.on("accept", () => {
  updateSecurityCode(securityCodeMask.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  //if ternário para alterar o código de segurança ao inserir informações no campo
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

/*
atualizar o número do cartão de crédito
*/
cardNumberMask.on("accept", () => {
  //para acessar o objeto cardNumberMask
  //currentMask - selecionar a máscara atualmente utilizada
  const cardType = cardNumberMask.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMask.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

/*
atualizar a data de expiração
*/
expirationDateMask.on("accept", () => {
  updateExpirationDate(expirationDateMask.value)
})

function updateExpirationDate(date) {
  const ccExpirationDate = document.querySelector(".cc-extra .value")

  ccExpirationDate.innerText = date.length === 0 ? "02/32" : date
}
