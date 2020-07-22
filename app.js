/*Copyright (c) Microsoft Corporation.
Licensed under the MIT license.*/

const express = require('express');
var mustacheExpress = require('mustache-express');
let bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { getProducts } = require('./products');

const app = express();
const port = 3000;

let cart = [];

app.set('views', `${__dirname}/views`);
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', async (req, res) => {
	const products = await getProducts();
	// console.log(JSON.stringify(products));
	res.render('app', { items: products });
});

app.get('/cart', async (req, res) => {
	const products = await getProducts();
	// match upp cart with products
	cart = cart.map((c) => {
		c.url = products.find((p) => p.id == c.id).url;
		return c;
	});

	res.json(cart);
});

app.post('/add', (req, res) => {
	console.log(req.body.id);
	if (cart.find((c) => c.id == req.body.id)) {
		cart = cart.map((c) => {
			if (c.id == req.body.id) {
				if (!c.amount) {
					c.amount = 1;
				}
				c.amount++;
			}
			return c;
		});
	} else {
		cart.push({ id: req.body.id });
	}

	res.send(`Added to cart`);
});

app.delete('/remove/:id', (req, res) => {
	const item = cart.find((c) => c.id == req.params.id);
	if (item.amount && item.amount > 1) {
		cart = cart.map((c) => {
			if (c.id == req.params.id) {
				c.amount--;
			}
			return c;
		});
	} else {
		cart = cart.filter((c) => c.id != req.params.id);
	}
	res.send(`Removed from cart`);
});

app.post('/checkout', async (req, res) => {
	console.log('cart', cart.length);
	if (cart.length === 0) {
		res.json({ error: 'Cart is empty, must have at least one item' });
	} else if (cart.length === 1 && cart[0].amount > 1) {
		res.json({ error: 'Cart has too many items, only one item can be purchased' });
	} else if (cart.length > 1) {
		res.json({ error: 'Cart has too many items, only one item can be purchased' });
	} else {
		const response = await await fetch('https://maya-api.azurewebsites.net/api/Shop', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id: cart[0].id }),
		});
		const json = await response.json();
		console.log('json', json);
		res.json(json);
	}
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
