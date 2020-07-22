/*Copyright (c) Microsoft Corporation.
Licensed under the MIT license.*/

const fetch = require('node-fetch');

let products = [];

async function getProducts() {
	if (products.length === 0) {
		const response = await fetch('https://maya-api.azurewebsites.net/api/Products');
		const items = await response.json();
		products = items;
		return items;
	} else {
		return new Promise((resolve, reject) => {
			resolve(products);
		});
	}
}

module.exports = {
	getProducts,
};
