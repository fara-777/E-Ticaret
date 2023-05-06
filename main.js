const categoriesList = document.querySelector(".categories");
const productList = document.querySelector(".products");
const modal = document.querySelector(".modal-wrapper");
const openBtn = document.querySelector("#open-btn");
const closeBtn = document.querySelector("#close-btn");
const modalList = document.querySelector(".modal-list");
const modalInfo = document.querySelector("#modal-info");

// Tarayici tarafina html icerigi yuklenmismi (DOMContentLoaded)
document.addEventListener("DOMContentLoaded", () => {
  //collback > icersinde farkli fonc calistirir
  fetchCategories();
  fetchProduct();
});

/* Kategorileri cekme */

function fetchCategories() {
  //veri cekme istegi atma
  fetch(" https://api.escuelajs.co/api/v1/categories")
    // gelen veriyi isleme
    .then((res) => res.json())
    // islenen veriyi forEach ile ekrana basma
    .then((data) =>
      data.slice(1, 5).forEach((category) => {
        // gelen her bir obje icin div olusturma
        const categoryDiv = document.createElement("div");
        // dive class ekleme
        categoryDiv.classList.add("category");
        // divin icerigini degistirme
        categoryDiv.innerHTML = `
        <img src="${category.image}" alt="" />
        <span>${category.name}</span>`;
        // divi htmldeki listeye ekleme
        categoriesList.appendChild(categoryDiv);
      })
    );
}

/* Ururnleri cekme */

function fetchProduct() {
  // apiye veri cekme istegi atma
  fetch("https://api.escuelajs.co/api/v1/products")
    // istek basarili olursa veriyi isle
    .then((res) => res.json())
    // islenen veriyi al ve ekrana bas
    .then((data) =>
      data.slice(2, 30).forEach((item) => {
        // div olusturma
        const productDiv = document.createElement("div");
        // bunlara class ekleme
        productDiv.classList.add("product");
        //  html icerigini degistirme
        productDiv.innerHTML = `
       <img src="${item.images}" alt="" />
       <p>${item.title}</p>
       <p>${item.category.name}</p>
       <div class="product-action">
         <p>${item.price}$</p>
         <button onclick="addToBasket({id:${item.id},title:'${item.title}',price:${item.price}, img:'${item.images[0]}', amount: 1})">Sepete ekle</button>
       </div>
      </div>`;
        //elemani html listeye gonderme
        productList.appendChild(productDiv);
      })
    );
}
/* Sepet islemleri */

let basket = [];
let total = 0;

// sepete ekleme işlemi
function addToBasket(product) {
  // sepette parametere olarak gelen eremanı arar
  const foundItem = basket.find((basketItem) => basketItem.id === product.id);

  if (foundItem) {
    // eğer elemandan varsa bulunan elmanın miktarını arttır
    foundItem.amount++;
  } else {
    // eğer elemandan sepette bulunmadıysa sepete ekle
    basket.push(product);
  }
}

// Açma ve Kapatma

openBtn.addEventListener("click", () => {
  modal.classList.add("active");
  // sepetin içine ürünleri listeleme
  addList();
  // toplam bilgisini güncelleme
  modalInfo.innerText = total;
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
  // sepeti kaptınca içini temizleme
  modalList.innerHTML = "";
  // toplam değerini sıfırlama
  total = 0;
});

// sepete listeleme fonksiyonu
function addList() {
  basket.forEach((product) => {
    console.log(product);
    // sepet dizisindeki her obje için div oluştur
    const listItem = document.createElement("div");
    // bunlara class ekle
    listItem.classList.add("list-item");
    // içeriğini değiştir
    listItem.innerHTML = `
              <img src="${product.img}" />
              <h2>${product.title}</h2>
              <h2 class="price">${product.price}  $</h2>
              <p>Miktar: ${product.amount}</p>
              <button id="delete" onclick="deleteItem({id:${product.id},price:${product.price} ,amount: ${product.amount}})">Sil</button>
    `;
    // elemanı htmldeki listeye gönderme
    modalList.appendChild(listItem);

    // toplam değişkenini güncelleme
    total += product.price * product.amount;
  });
}

// sepet dizisinden silme fonksiyonu
function deleteItem(deletingItem) {
  basket = basket.filter((i) => i.id !== deletingItem.id);
  // silinen elemanın fiyatını total'den çıkartma
  total -= deletingItem.price * deletingItem.amount;

  modalInfo.innerText = total;
}

// silinen elemanı htmlden kaldırma
modalList.addEventListener("click", (e) => {
  if (e.target.id === "delete") {
    e.target.parentElement.remove();
  }
});

// eğer dışarıya tıklanırsa kapatma
modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-wrapper")) {
    modal.classList.remove("active");
  }
});
