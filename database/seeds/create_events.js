import { lorem, date as _date, image as _image, address, internet, random, commerce } from 'faker'
export function seed (knex) {
	const events = []
	const tickets = []
	const organisableIds = []
	for (let index = 1; index < 100; index++) {
		organisableIds.push(index)
	}

	for (let row = 0; row < 5000; row++) {
		const about = lorem.sentence()
		const date = _date.future(0.03)
		// Create events
		events.push({
			image: _image.imageUrl(null, 500, null, true, true),
			location: address.streetAddress(),
			online_link: internet.url(),
			about: about.charAt(0).toLocaleUpperCase() + about.slice(1),
			description: lorem.paragraphs(10),
			startDate: date,
			endDate: _date.future(0.001, date),
			organisable_id: random.arrayElement(organisableIds),
			organisable_type: random.arrayElement(['User', 'Group'])
		})
		// Create tickets
		tickets.push({
			event_id: row + 1,
			price: commerce.price(1000, 10000),
			limit: 0,
			type: random.arrayElement(['VIP', 'Regular', 'General'])
		})
	}
	// Deletes ALL existing entries
	return knex('events').insert(events).then(() => {
		return knex('tickets').insert(tickets)
	})
}
