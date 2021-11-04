/* eslint-disable camelcase */

import { random, company, image, lorem, address } from 'faker'
import slugify from '../../app/actions/slugify'
const rows = []
const organisers = []
const members = []
const ids = []
for (let i = 1; i < 101; i++) {
	ids.push(i)
}
for (let index = 1; index < 5001; index++) {
	organisers.push({
		group_id: random.arrayElement(ids),
		user_id: random.arrayElement(ids)
	})
	members.push({
		user_id: random.arrayElement(ids),
		group_id: random.arrayElement(ids)
	})
}
for (let index = 0; index < 5000; index++) {
	const name = `${company.companyName()}, ${company.catchPhrase()}`
	rows.push({
		pictureUrl: image.imageUrl(700, null, 'business', false, true),
		name,
		slug: slugify(name),
		description: lorem.paragraphs(3),
		country: address.country(),
		city: address.city(),
		visibility: 'public',
		timezone: 'Africa/Nairobi'
	})
}
export function seed (knex) {
	// Del
	return knex('groups').insert(rows).then(() => {
		return knex('group_organisers').insert(organisers).then(() => {
			return knex('group_user').insert(members)
		})
	})
}
