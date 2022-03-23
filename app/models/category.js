import { Model, DB } from 'mevn-orm'

class Category extends Model {
	static async all() {
		return DB('categories').select(['id', 'name'])
	}
}


export default Category
