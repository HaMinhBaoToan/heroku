const db = require("../utils/db");

module.exports = {
  all() {
    return db("category").where("isActive",true);
  },
  allAdmin() {
    // return db("category").leftJoin('categorygroup', 'categorygroup.CategoryGroupId', '=', 'category.CategoryId')
    return db({ a: 'category', b: 'categorygroup', c: 'users' })
    .select('a.*',{
      categoryImage: 'a.Image',
      categorygroupImage: 'b.Image',
      NameTeacher: 'c.DislayName',
      CategoryGroupName:'b.CategoryGroupName'
    })
    .whereRaw('?? = ?? and ?? = ?? ', ['a.CategoryGroupId', 'b.CategoryGroupId','c.UsersID','a.TeacherID'])

  },
  async single(CategoryId) {
     const category = await db({ a: 'category', b: 'categorygroup'})
    .select('a.*',{
      categoryImage: 'a.Image',
      categorygroupImage: 'b.Image',
      CategoryGroupName:'b.CategoryGroupName'
    })
    .whereRaw('?? = ?? ', ['a.CategoryGroupId', 'b.CategoryGroupId'])
    .where('a.CategoryId', CategoryId);
    if (category.length === 0) {
      return null;
    }
    return category[0];

    return 
  },
  async ByUserID(usersid) {
      
    return db({ a: 'category', b: 'categorygroup', c: 'users' })
    .select('a.*',{
      categoryImage: 'a.Image',
      categorygroupImage: 'b.Image',
      NameTeacher: 'c.DislayName',
      CategoryGroupName:'b.CategoryGroupName'
    })
    .whereRaw('?? = ?? and ?? = ?? ', ['a.CategoryGroupId', 'b.CategoryGroupId','c.UsersID','a.TeacherID'])
    .where('c.usersid', usersid);
  },
  async add(category) {
    const ids = await db("category").insert(category);
    return ids[0];
  },

  del(CategoryId) {
    return db("category").where("CategoryId", CategoryId).del();
  },

  update(CategoryId, Category) {
    return db("Category").where("CategoryId", CategoryId).update(Category);
  },

  async courses(CategoryGroupId) {
    const category = await db("category").where("CategoryGroupId", CategoryGroupId);
    if (category.length === 0) {
      return null;
    }
    return category;
  },

  async showCategory() {
    var date = new Date();
    return db.select('category.*','categorygroup.CategoryGroupName','users.DislayName','discount.value'
                      , db.raw(`(SELECT CASE WHEN SUM(VIEWER) IS NULL THEN 0 ELSE SUM(VIEWER) END
                                 From product Where product.CategoryId = category.CategoryId AND PRODUCT.ISACTIVE = 1) AS TotalView`)) 
    .from('category')
    .leftJoin('categorygroup','category.CategoryGroupId', 'categorygroup.CategoryGroupId')
    .leftJoin('users','users.UsersId', 'category.Teacherid')
    .leftJoin('discount', function() {
        this.on('discount.CategoryId', '=', 'category.CategoryId')
        this.andOn('discount.isActive', '=', 1)
        this.andOn(date,'>=', 'discount.Fromdate')
        this.andOn(date,'<=', 'discount.Todate')

    })
    .where('category.isActive',true);
  },

  async getCategory(CategoryId, UsersId) {
    var date = new Date();
    const category = await db.select('category.*'
                                      ,'categorygroup.CategoryGroupName'
                                      ,'users.Image as Ava'
                                      ,'users.DislayName'
                                      ,'users.TeacherNote'
                                      ,'discount.value'
                                      ,'R1.Rate1', 'R2.Rate2', 'R3.Rate3' , 'R4.Rate4' , 'R5.Rate5'
                                      ,db.raw("R1.Rate1 + R2.Rate2 + R3.Rate3 + R4.Rate4 + R5.Rate5 AS TotalRate") 
                                      ,db.raw("CASE WHEN resdetail.UsersId is null THEN 0 ELSE 1 END AS IsRes") 
                                      ,'product.*'
                                    )
    .from('category')
    .leftJoin('categorygroup','category.CategoryGroupId', 'categorygroup.CategoryGroupId')
    .leftJoin('users','users.UsersId', 'category.Teacherid')
    .leftJoin('ratedetail','category.CategoryId', 'ratedetail.CategoryId')
    .leftJoin('resdetail', function() {
        this.on('resdetail.CategoryId', '=' , 'category.CategoryId')
        this.andOn('resdetail.UsersId', '=' , UsersId)
        this.andOn('resdetail.IsActive', '=', 1)
    })
    .leftJoin('discount', function() {
        this.on('discount.CategoryId', '=', 'category.CategoryId')
        this.andOn('discount.isActive', '=', 1)
        this.andOn(date,'>=', 'discount.Fromdate')
        this.andOn(date,'<=', 'discount.Todate')
    })
    .leftJoin(db('ratedetail')
              .count('RateValue as Rate1')
              .where('RateValue',1)
              .andWhere('CategoryId',CategoryId).as('R1') ,0, 0 )
    .leftJoin(db('ratedetail')
              .count('RateValue as Rate2')
              .where('RateValue',2)
              .andWhere('CategoryId',CategoryId).as('R2') ,0, 0 )
    .leftJoin(db('ratedetail')
              .count('RateValue as Rate3')
              .where('RateValue',3)
              .andWhere('CategoryId',CategoryId).as('R3') ,0, 0 )
    .leftJoin(db('ratedetail')
              .count('RateValue as Rate4')
              .where('RateValue',4)
              .andWhere('CategoryId',CategoryId).as('R4') ,0, 0 )
    .leftJoin(db('ratedetail')
              .count('RateValue as Rate5')
              .where('RateValue',5)
              .andWhere('CategoryId',CategoryId).as('R5') ,0, 0 )
    .leftJoin('product', function() {
        this.on('product.CategoryId', '=', 'category.CategoryId')
        this.andOn('product.IsActive', '=', 1)
    })
    .where('category.isActive',true)
    .andWhere("category.CategoryId", CategoryId)
    .groupBy('category.CategoryId', 'product.ProductId');
    

    if (category.length === 0) {
      return null;
    }
    return category;
  },

  updateProductView(id, quanview) {
    return db("product").where("ProductId", id).update('Viewer', quanview);
  },

};
