/* eslint-disable no-console */
import  {DB} from 'mevn-orm'
(function createCategories() {
	const categories = [
		{
			name: 'Webinars',
			description: 'Webinars are seminars conducted on the internet.',
		},
		{
			name: 'Meetups',
			description: 'an informal meeting or gathering.',
		},
		{
			name: 'Workshops',
			description: 'a meeting at which a group of people engage in intensive discussion and activity on a particular subject or project.',
		},
		{
			name: 'Conferences',
			description: 'a formal meeting of people with a shared interest, typically one that takes place over several days.',
		},
		{
			name: 'Seminars',
			description: 'a conference or other meeting for discussion or training.'
		},
		{
			name: 'Concerts',
			description: 'a performance that takes place in a theater.',
		},
		{
			name: 'Exhibitions',
			description: 'a display of works by an art gallery.',
		},
		{
			name: 'Hiking and outdoor activities',
			description: 'a walk or hike in nature.',
		},
		{
			name: 'Fashion',
			description: 'fashion is the art, design, and practice of attaining a style or fashion by wearing or dressing oneself.',
		},
		{
			name: 'Cars and motorcycles',
			description: 'Everyday people use cars and motorcycles to travel around the world.',
		},
		{
			name: 'Business',
			description: 'Business is the activity of buying and selling goods and services.',
		},
		{
			name: 'Health',
			description: 'Health is the state of being fit, healthy, and well-being.',
		},
		{
			name: 'Education',
			description: 'Education is the process of learning and acquiring knowledge.',
		},
		{
			name: 'Religion',
			description: 'Religion is the belief system of a community.',
		},
		{
			name: 'Travel',
			description: 'Travel is the movement of people or things from place to place.',
		},
		{
			name: 'Others',
			description: 'Other categories are not listed here.',
		}
	]

	DB('categories').delete()
		.then(() => {
			console.log('Categories table is empty.')
		})
		.catch(err => {
			console.log(err)
			process.exit(1)
		})
    
	DB('categories').insert(categories)
		.then(() => {
			console.log('Categories created successfully.')
			process.exit(0)
		})
		.catch(err => {
			console.log(err)
			process.exit(1)
		})
}())
