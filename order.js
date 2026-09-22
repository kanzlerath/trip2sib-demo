const dishes=[
{id:"tartar",cat:"popular",name:"Тар-тар из лосося",desc:"Лосось, авокадо, цитрусовая заправка, микрозелень",price:690,img:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80"},
{id:"beef",cat:"hot",name:"Томлёные говяжьи щёчки",desc:"Картофельное пюре, соус из красного вина",price:790,img:"https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80"},
{id:"soup",cat:"soups",name:"Крем-суп из тыквы",desc:"Тыква, кокосовое молоко, семечки, зелёное масло",price:490,img:"https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80"},
{id:"pate",cat:"snacks",name:"Паштет с бриошью",desc:"Куриный паштет, бриошь, ягодный конфитюр",price:590,img:"https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=900&q=80"},
{id:"syrniki",cat:"desserts",name:"Сырники с сезонными ягодами",desc:"Домашний ягодный соус и сметана",price:490,img:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80"},
{id:"drink",cat:"drinks",name:"Лимонад из облепихи",desc:"Облепиха, апельсин, мята",price:350,img:"https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80"},
{id:"bruschetta",cat:"snacks",name:"Брускетта с ростбифом",desc:"Ростбиф, печёный перец, соус тоннато",price:620,img:"https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=900&q=80"},
{id:"pasta",cat:"hot",name:"Паста с томлёной уткой",desc:"Домашняя паста, утка, пармезан",price:730,img:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80"}
];
const cart=new Map();
const grid=document.querySelector(".menu-grid");
const countLabel=document.querySelector(".menu-count");
const cartItems=document.querySelector(".cart-items");
const cartCount=document.querySelector(".cart__count");
const subtotalEl=document.querySelector(".subtotal");
const totalEl=document.querySelector(".total-value");
const minOrder=document.querySelector(".min-order");
const checkout=document.querySelector(".checkout");
const mobileCount=document.querySelector(".mobile-count");
const mobileTotal=document.querySelector(".mobile-total");
const cartPanel=document.querySelector(".cart");
const toast=document.querySelector(".toast");
function money(n){return new Intl.NumberFormat("ru-RU").format(n)+" ₽"}
function renderDishes(filter){
  filter=filter||"popular"; grid.innerHTML="";
  const list=filter==="popular"?dishes.slice(0,6):dishes.filter(function(x){return x.cat===filter});
  countLabel.textContent=list.length+" блюд";
  list.forEach(function(d){
    const el=document.createElement("article"); el.className="dish";
    el.innerHTML='<div class="dish__img" style="background-image:url(&quot;'+d.img+'&quot;)"></div>'+
    '<div class="dish__body"><h3>'+d.name+'</h3><p>'+d.desc+'</p>'+
    '<div class="dish__bottom"><span class="dish__price">'+money(d.price)+'</span>'+
    '<button class="add '+(cart.has(d.id)?"added":"")+'" data-id="'+d.id+'">'+(cart.has(d.id)?"Добавлено":"В корзину")+'</button></div></div>';
    grid.appendChild(el);
  });
}
function renderCart(){
  cartItems.innerHTML=""; let items=0,total=0;
  cart.forEach(function(qty,id){
    const d=dishes.find(function(x){return x.id===id}); items+=qty; total+=d.price*qty;
    const row=document.createElement("div"); row.className="cart-item";
    row.innerHTML='<div class="cart-item__top"><span>'+d.name+'</span><button class="remove" data-id="'+id+'" aria-label="Удалить">×</button></div>'+
    '<div class="cart-item__controls"><div class="qty"><button data-act="minus" data-id="'+id+'">−</button><span>'+qty+'</span><button data-act="plus" data-id="'+id+'">+</button></div><strong>'+money(d.price*qty)+'</strong></div>';
    cartItems.appendChild(row);
  });
  if(!items) cartItems.innerHTML='<div class="cart-empty">Корзина пока пустая.<br>Добавьте блюда из меню.</div>';
  cartCount.textContent=items; mobileCount.textContent=items; subtotalEl.textContent=money(total); totalEl.textContent=money(total); mobileTotal.textContent=money(total);
  const left=Math.max(0,1000-total);
  minOrder.textContent=left?"Минимальный заказ — 1 000 ₽. Добавьте ещё на "+money(left)+".":"Минимальный заказ набран";
  minOrder.classList.toggle("ok",!left); checkout.disabled=!!left || !items;
  document.querySelectorAll(".add").forEach(function(b){const inCart=cart.has(b.dataset.id);b.classList.toggle("added",inCart);b.textContent=inCart?"Добавлено":"В корзину"});
}
document.addEventListener("click",function(e){
  const add=e.target.closest(".add"); if(add){cart.set(add.dataset.id,(cart.get(add.dataset.id)||0)+1);renderCart();showToast("Блюдо добавлено в корзину")}
  const rem=e.target.closest(".remove"); if(rem){cart.delete(rem.dataset.id);renderCart()}
  const q=e.target.closest("[data-act]"); if(q){const id=q.dataset.id;let n=cart.get(id)||0;n+=q.dataset.act==="plus"?1:-1;if(n<=0)cart.delete(id);else cart.set(id,n);renderCart()}
  const cat=e.target.closest("[data-cat]"); if(cat){document.querySelectorAll("[data-cat]").forEach(function(b){b.classList.remove("active")});cat.classList.add("active");renderDishes(cat.dataset.cat);renderCart()}
});
document.querySelectorAll("[data-mode]").forEach(function(b){b.addEventListener("click",function(){document.querySelectorAll("[data-mode]").forEach(function(x){x.classList.remove("active")});b.classList.add("active");showToast(b.dataset.mode==="delivery"?"Выбрана доставка":"Выбран самовывоз")})});
document.querySelector(".mobile-cart button").addEventListener("click",function(){cartPanel.classList.toggle("open")});
checkout.addEventListener("click",function(){showToast("Демо: здесь откроется оформление заказа")});
function showToast(t){toast.textContent=t;toast.classList.add("show");clearTimeout(window.__tt);window.__tt=setTimeout(function(){toast.classList.remove("show")},1800)}
renderDishes();renderCart();