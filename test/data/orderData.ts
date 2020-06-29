/**
 * Orders from two stores [1234, 4567]
 * three orders in each store
 */
export const orderData = {
	store: {
		1234: {
			orders: {
				abcd: {
					id: "abcd",
					name: "Big Big",
					price: 3000,
					store: '1234',
					lastUpdated: 111,
					createdAt: 111
				},
				defg: {
					id: "defg",
					name: "Small Big",
					price: 1300,
					store: '1234',
					lastUpdated: 112,
					createdAt: 112
				},
				aaaa: {
					id: "aaaa",
					name: "Grape Vine",
					price: 452,
					store: '1234',
					lastUpdated: 113,
					createdAt: 113
				}
			}
		},
		4567: {
			orders: {
				bbbb: {
					id: "bbbb",
					name: "Yellow Milk",
					price: 152,
					store: '4567',
					lastUpdated: 114,
					createdAt: 114
				},
				cccc: {
					id: "cccc",
					name: "Angry Tea",
					price: 552,
					store: '4567',
					lastUpdated: 114,
					createdAt: 114
				},
				dede: {
					id: "dede",
					name: "Pretty Moon",
					price: 865,
					store: '4567',
					lastUpdated: 114,
					createdAt: 114
				},
			}
		}
	}
}