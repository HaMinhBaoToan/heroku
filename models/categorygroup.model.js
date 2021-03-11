const db = require("../utils/db");

module.exports = {

  all() {
    return db("categorygroup");
  },
  add(category) {
    return db("categorygroup").insert(category);
  },
  update(id, category) {
    return db('categorygroup').where('CategoryGroupId', id).update(category)
  },
  delete(id) {
    return db('categorygroup')
      .where('CategoryGroupId', id)
      .del();
  },
  GetCategoryByCategoryGroupId(id) {
    return db({ a: 'categorygroup', b: 'category' })
      .whereRaw('?? = ?? ', ['a.CategoryGroupId', 'b.CategoryId'])
      .where('a.CategoryGroupId', id);

    // return  db('categorygroup')
    // .leftJoin('category', 'categorygroup.CategoryGroupId', '=', 'category.CategoryId')
    // .where('categorygroup.CategoryGroupId', id);
  }
};
