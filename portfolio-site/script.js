document.addEventListener("click",function(e){
var b=e.target.closest(".burger");
if(b){var o=document.getElementById("links").classList.toggle("open");b.setAttribute("aria-expanded",o);return}
var l=e.target.closest(".links a");if(l)document.getElementById("links").classList.remove("open");
var m=e.target.closest(".more");
if(m){var d=m.closest(".pane").querySelector(".det"),on=d.classList.toggle("on");m.setAttribute("aria-expanded",on);m.textContent=on?"Show less":"Read more"}});
document.addEventListener("keydown",function(e){if(e.key==="Escape")document.getElementById("links").classList.remove("open")});
