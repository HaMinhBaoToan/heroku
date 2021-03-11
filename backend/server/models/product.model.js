const db = require("../utils/db");

module.exports = {
  all() {
    return db("product");
  },
  add(product) {
    return db("product").insert(product);
  },

  GetProductByCategoryId(id) {
    return db({ a: "product", b: "category" })
      .whereRaw("?? = ?? ", ["a.CategoryId", "b.CategoryId"])
      .where("a.CategoryId", id);
  },
};
