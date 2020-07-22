function buildCart(items) {
  const cartElem = document.getElementById("cart");
  if (items.length === 0) {
    cartElem.innerHTML = `
    <h2>Cart</h2>
    Empty cart`;
  } else {
    let html = items.reduce((acc, curr) => {
      return (
        acc +
        `
      <div> 
        Quantity: ${curr.amount ? curr.amount : 1}
        <img width="50px" src="${curr.url}"/> 
        <button onclick="remove(${curr.id})">Remove</button>
      </div>`
      );
    }, "");
    html = '<h2>Cart</h2>' + html

    cartElem.innerHTML = html;
  }
}

function remove(id) {
  console.log("remove id", id);
  fetch(`/remove/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.text())
    .then((text) => {
      getCart();
    });
}

function getCart() {
  fetch("/cart")
    .then((res) => res.json())
    .then((items) => {
      buildCart(items);
    });
}

function add(id, url) {
  console.log("id", id);
  fetch("/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, url }),
  }).then(() => {
    getCart();
  });
}

function checkout() {
  fetch("/checkout", {
    method: "POST",
  })
    .then((res) => res.json())
    .then((text) => {
      if (text.error) {
        alert(text.error);
      } else {
        alert(text.message + (text.secret ? text.secret : ''));
      }
      
    });
}

getCart();
