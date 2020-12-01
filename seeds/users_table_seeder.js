
exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex('users').del()
		.then(function () {
			// Inserts seed entries
			return knex('users').insert([
				{
					name: 'John Doe',
					email: 'John@example.com',
					password: 'secret',
					Bio: 'Awesome Bio' 
				},
				{
					name: 'Jane Doe',
					email: 'Jane@example.com',
					password: 'secret',
					Bio: 'Awesome Bio for jane' 
				},
			])
		})
}
