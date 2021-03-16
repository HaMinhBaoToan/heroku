const db = require("../utils/db");

module.exports = {
  all() {
    return db("product");
  },
  add(product) {
    return db("product").insert(product);
  },
  update(id, product) {
    return db("product").where("ProductId", id).update(product);
  },
  delete(id) {
    return db('product')
      .where('ProductId', id)
      .del();
  },
  GetProductByCategoryId(id) {
    return db({ a: "product", b: "category" })
      .whereRaw("?? = ?? ", ["a.CategoryId", "b.CategoryId"])
      .where("a.CategoryId", id)
      .orderBy('a.NumberNo', 'asc')
  },
};
