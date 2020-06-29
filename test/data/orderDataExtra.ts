/**
 * Orders from two stores [1234, 4567]
 * three orders in each store
 */
export const orderData = {
	store: {
		1234: {
			orders: {
				abcd: {
					id: "alfr",
					name: "Red Big",
					price: 300,
					store: '1234',
					lastUpdated: 111,
					createdAt: 111
				},
				defg: {
					id: "erdd",
					name: "All White",
					price: 130,
					store: '1234',
					lastUpdated: 112,
					createdAt: 112
				},
			}
		},
		4567: {
			orders: {
				kjls: {
					id: "kjls",
					name: "Alfred Max",
					price: 98,
					store: '4567',
					lastUpdated: 114,
					createdAt: 114
				},
				andk: {
					id: "andk",
					name: "Grey Watch",
					price: 120,
					store: '4567',
					lastUpdated: 114,
					createdAt: 114
				},
			}
		}
	}
}