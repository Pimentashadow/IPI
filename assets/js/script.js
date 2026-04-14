const nav = document.querySelector("#links");
const botao = document.querySelector("#menu-hamburguer");

botao.addEventListener("click", () => {
  nav.classList.toggle("arise");
});