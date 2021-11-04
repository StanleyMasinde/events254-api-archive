import { company, name as _name, internet } from 'faker'

const rows = []
for (let index = 0; index < 500; index++) {
	const bio = company.catchPhrase()
	rows.push({
		name: _name.findName(),
		email: internet.exampleEmail(),
		password: internet.password(8),
		bio
	})
}
export function seed (knex) {
	// Deletes ALL existing entries
	return knex('users').insert(rows)
}
