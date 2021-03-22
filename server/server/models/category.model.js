const db = require("../utils/db");

moment = require('moment');

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

  updateProductView(id, quanview) {
    return db("product").where("ProductId", id).update('Viewer', quanview);
  },
  async UserByCategoryID(id){
    // return db("resdetail").distinct('UsersId').where("CategoryId", id);
    return db({ a: 'category', b: 'resdetail', c: 'users' })
    .select({
      categoryName: 'a.categoryName',
      NameTeacher: 'c.DislayName',
      UsersId:'b.UsersId'
    })
    .whereRaw('?? = ?? and ?? = ?? ', ['a.CategoryId', 'b.CategoryId','c.UsersID','a.TeacherID'])
    .where('b.CategoryId', id);
  },
  // Chi tiết từng khóa học
  async getCategory(CategoryId, UsersId) {
    var date = new Date();
    const category = await db.select(db.raw(` C.*
                                            , P.ProductId
                                            , P.NumberNo
                                            , P.ProductName
                                            , P.Video
                                            , P.Public
                                            , P.Viewer
                                            , CG.CategoryGroupName
                                            , U.Image AS Ava
                                            , U.DislayName
                                            , U.TeacherNote
                                            , CASE WHEN D.Value IS NULL THEN 0 ELSE D.Value END AS Value
                                            , CASE WHEN RD.USERSID IS NULL THEN 0 ELSE 1 END AS IsRes
                                            , CASE WHEN LD.USERSID IS NULL THEN 0 ELSE 1 END AS IsLike
                                            , CASE WHEN CMT.USERSID IS NULL THEN 0 ELSE 1 END AS IsCmt
                                            , CASE WHEN CMT.USERSID IS NULL THEN 0 ELSE CMT.RateValue END AS RateValue
                                            , R1.Rate1
                                            , R2.Rate2
                                            , R3.Rate3
                                            , R4.Rate4
                                            , R5.Rate5
                                            , R1.Rate1 + R2.Rate2 + R3.Rate3 + R4.Rate4 + R5.Rate5 AS TotalRate
                                            `))
                              .from('CATEGORY AS C')
                              .leftJoin(db.raw(`CATEGORYGROUP AS CG ON C.CATEGORYGROUPID = CG.CATEGORYGROUPID`))
                              .leftJoin(db.raw(`USERS AS U ON C.TEACHERID = U.USERSID`))
                              .leftJoin(db.raw(`DISCOUNT AS D ON (C.CATEGORYID = D.CATEGORYID
                                                              AND D.ISACTIVE = TRUE
                                                              AND D.FROMDATE <= ?
                                                              AND D.ENDDATE >= ?)`,  [date,date] ))
                              .leftJoin(db.raw(`RESDETAIL AS RD ON C.CATEGORYID = RD.CATEGORYID
                                                                AND RD.USERSID = ?
                                                                AND RD.ISACTIVE = TRUE`, [ UsersId]))
                              .leftJoin(db.raw(`LIKEDETAIL AS LD ON C.CATEGORYID = LD.CATEGORYID
                                                                AND LD.USERSID = ?
                                                                AND LD.ISACTIVE = TRUE`, [ UsersId]))
                              .leftJoin(db.raw(`PRODUCT AS P ON C.CATEGORYID = P.CATEGORYID
                                                              AND P.ISACTIVE = TRUE`))
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
                              .leftJoin(db.raw(`RATEDETAIL AS CMT ON CMT.CATEGORYID = C.CATEGORYID
                                                                    AND CMT.USERSID = ?`, [ UsersId] ))
                              .whereRaw('C.ISACTIVE = TRUE')
                              .andWhereRaw(`C.CATEGORYID = ?`, [CategoryId] )
                              .groupBy(`C.CATEGORYID`, `P.PRODUCTID`)
                              .orderBy(`P.NUMBERNO`)    
    if (category.length === 0) {
      return null;
    }
    return category;
  },

  // Hàm truy vấn tìm kiếm khóa học có sắp xếp. //Home
  async showCategoryOrderBy(orderbyType, limit) {
    var date = new Date();
    const categoryList =  db.select(db.raw(`C.*
                                      , CG.CategoryGroupName
                                      , U.DislayName
                                      , D.Value
                                      , CASE WHEN V.TOTALVIEW IS NULL THEN 0 ELSE V.TOTALVIEW END AS TotalView`))
                        .from('CATEGORY AS C')
                        .leftJoin(db.raw(`CATEGORYGROUP AS CG ON C.CATEGORYGROUPID = CG.CATEGORYGROUPID`))
                        .leftJoin(db.raw(`USERS AS U ON C.TEACHERID = U.USERSID`))
                        .leftJoin(db.raw(`DISCOUNT AS D ON (D.CATEGORYID = C.CATEGORYID
                                                        AND D.ISACTIVE = TRUE
                                                        AND D.FROMDATE <= ?
                                                        AND D.ENDDATE >= ?)`,  [date,date] ))
                        .leftJoin(db.raw(`(SELECT CATEGORYID, SUM(VIEWER) AS TOTALVIEW
                                           FROM PRODUCT
                                           WHERE ISACTIVE = TRUE) AS V ON V.CATEGORYID = C.CATEGORYID`))
                        .whereRaw('C.ISACTIVE = ?', true)
                        .orderBy(orderbyType, 'DESC')
                        .limit(limit);
    if (categoryList.length === 0) {
      return null;
    }
    return categoryList;
  },

  async showCategorySortWeekLikeDetail(limit) {
    var date = new Date();
    var fromDateLastWeek = new Date();
    fromDateLastWeek.setDate(fromDateLastWeek.getDate() - 7 - 7 + 2);
    var toDateLastWeek = new Date();
    toDateLastWeek.setDate(fromDateLastWeek.getDate() + 6 );   

    const categoryList =  db.select(db.raw(`C.*
                                      , CG.CategoryGroupName
                                      , U.DislayName
                                      , D.Value
                                      , CASE WHEN V.TOTALVIEW IS NULL THEN 0 ELSE V.TOTALVIEW END AS TotalView
                                      , CASE WHEN LK.CATEGORYID IS NULL THEN 0 ELSE 1 END AS IsLikeWeek`))
                        .from('CATEGORY AS C')
                        .leftJoin(db.raw(`CATEGORYGROUP AS CG ON C.CATEGORYGROUPID = CG.CATEGORYGROUPID`))
                        .leftJoin(db.raw(`USERS AS U ON C.TEACHERID = U.USERSID`))
                        .leftJoin(db.raw(`DISCOUNT AS D ON (D.CATEGORYID = C.CATEGORYID
                                                        AND D.ISACTIVE = TRUE
                                                        AND D.FROMDATE <= ?
                                                        AND D.ENDDATE >= ?)`,  [date,date] ))
                        .leftJoin(db.raw(`(SELECT CATEGORYID, SUM(VIEWER) AS TOTALVIEW
                                           FROM PRODUCT
                                           WHERE ISACTIVE = TRUE) AS V ON V.CATEGORYID = C.CATEGORYID`))
                        .leftJoin(db.raw(`(SELECT CATEGORYID, COUNT(USERSID) AS TotalLike
                                           FROM LIKEDETAIL
                                           WHERE ISACTIVE = TRUE
                                           AND LIKETIME >= ?
                                           AND LIKETIME <= ?
                                           GROUP BY CATEGORYID
                                           ORDER BY TotalLike
                                           LIMIT ${limit} ) AS LK ON LK.CATEGORYID = C.CATEGORYID`, [moment(fromDateLastWeek).format("YYYY-MM-DD"), moment(toDateLastWeek).format("YYYY-MM-DD")]  ))
                        .whereRaw('C.ISACTIVE = ?', true)
                        .orderBy('IsLikeWeek', 'DESC')
                        .limit(limit);
    if (categoryList.length === 0) {
      return null;
    }
    return categoryList;
  },

  async showCategorySortWeekResDetail(limit) {
    var date = new Date();
    var fromDateLastWeek = new Date();
    fromDateLastWeek.setDate(fromDateLastWeek.getDate() - 7 - 7 + 2);
    var toDateLastWeek = new Date();
    toDateLastWeek.setDate(fromDateLastWeek.getDate() + 6 );   

    const categoryList =  db.select(db.raw(`C.*
                                      , CG.CategoryGroupName
                                      , U.DislayName
                                      , D.Value
                                      , CASE WHEN V.TOTALVIEW IS NULL THEN 0 ELSE V.TOTALVIEW END AS TotalView
                                      , CASE WHEN LK.CATEGORYID IS NULL THEN 0 ELSE 1 END AS IsResWeek`))
                        .from('CATEGORY AS C')
                        .leftJoin(db.raw(`CATEGORYGROUP AS CG ON C.CATEGORYGROUPID = CG.CATEGORYGROUPID`))
                        .leftJoin(db.raw(`USERS AS U ON C.TEACHERID = U.USERSID`))
                        .leftJoin(db.raw(`DISCOUNT AS D ON (D.CATEGORYID = C.CATEGORYID
                                                        AND D.ISACTIVE = TRUE
                                                        AND D.FROMDATE <= ?
                                                        AND D.ENDDATE >= ?)`,  [date,date] ))
                        .leftJoin(db.raw(`(SELECT CATEGORYID, SUM(VIEWER) AS TOTALVIEW
                                           FROM PRODUCT
                                           WHERE ISACTIVE = TRUE) AS V ON V.CATEGORYID = C.CATEGORYID`))
                        .leftJoin(db.raw(`(SELECT CATEGORYID, COUNT(USERSID) AS TotalRes
                                           FROM RESDETAIL
                                           WHERE ISACTIVE = TRUE
                                           AND RESTIME >= ?
                                           AND RESTIME <= ?
                                           GROUP BY CATEGORYID
                                           ORDER BY TotalRes
                                           LIMIT ${limit} ) AS LK ON LK.CATEGORYID = C.CATEGORYID`, [moment(fromDateLastWeek).format("YYYY-MM-DD"), moment(toDateLastWeek).format("YYYY-MM-DD")]  ))
                        .whereRaw('C.ISACTIVE = ?', true)
                        .orderBy('IsResWeek', 'DESC')
                        .limit(limit);
    if (categoryList.length === 0) {
      return null;
    }
    return categoryList;
  },

  // Hàm truy vấn các khóa học thuộc lĩnh vực //Courses
  async getCategoryByGroupId(userid, CategoryGroupId) {
    var date = new Date();
    const categoryList = await db.select(db.raw(`C.*
                                          ,CG.CategoryGroupName
                                          ,U.DislayName
                                          , CASE WHEN RD.USERSID IS NULL THEN 0 ELSE 1 END AS IsRes
                                          , CASE WHEN RD.USERSID IS NULL THEN 0 ELSE RD.IsDone END AS IsDone
                                          ,D.Value`))
                              .from('CATEGORY AS C')
                              .leftJoin(db.raw(`CATEGORYGROUP AS CG ON C.CATEGORYGROUPID = CG.CATEGORYGROUPID`))
                              .leftJoin(db.raw(`USERS AS U ON C.TEACHERID = U.USERSID`))
                              .leftJoin(db.raw(`DISCOUNT AS D ON (D.CATEGORYID = C.CATEGORYID
                                                              AND D.ISACTIVE = TRUE
                                                              AND D.FROMDATE <= ?
                                                              AND D.ENDDATE >= ?)`,  [date,date] ))
                              .leftJoin(db.raw(`RESDETAIL AS RD ON C.CATEGORYID = RD.CATEGORYID
                                                              AND RD.USERSID = ?
                                                              AND RD.ISACTIVE = TRUE`, [ userid]))
                              .whereRaw('C.ISACTIVE = ?', true)
                              .andWhereRaw('C.CATEGORYGROUPID = ?', CategoryGroupId)
    if (categoryList.length === 0) {
      return null;
    }
    return categoryList;
  },

    // Hàm truy vấn các khóa học thuộc lĩnh vực //Courses
  async getCategoryAllGroup(userid) {
    var date = new Date();
    const categoryList = await db.select(db.raw(`C.*
                                          ,CG.CategoryGroupName
                                          ,U.DislayName
                                          , CASE WHEN RD.USERSID IS NULL THEN 0 ELSE 1 END AS IsRes
                                          , CASE WHEN RD.USERSID IS NULL THEN 0 ELSE RD.IsDone END AS IsDone
                                          ,D.Value`))
                              .from('CATEGORY AS C')
                              .leftJoin(db.raw(`CATEGORYGROUP AS CG ON C.CATEGORYGROUPID = CG.CATEGORYGROUPID`))
                              .leftJoin(db.raw(`USERS AS U ON C.TEACHERID = U.USERSID`))
                              .leftJoin(db.raw(`DISCOUNT AS D ON (D.CATEGORYID = C.CATEGORYID
                                                              AND D.ISACTIVE = TRUE
                                                              AND D.FROMDATE <= ?
                                                              AND D.ENDDATE >= ?)`,  [date,date] ))
                              .leftJoin(db.raw(`RESDETAIL AS RD ON C.CATEGORYID = RD.CATEGORYID
                                                              AND RD.USERSID = ?
                                                              AND RD.ISACTIVE = TRUE`, [userid]))
                              .whereRaw('C.ISACTIVE = ?', true)
    if (categoryList.length === 0) {
      return null;
    }
    return categoryList;
  },

  async getCategorybySearch(userid, keyword) {
    var date = new Date();
    const categoryList = await db.select(db.raw(`C.*
                                          ,CG.CategoryGroupName
                                          ,U.DislayName
                                          , CASE WHEN RD.USERSID IS NULL THEN 0 ELSE 1 END AS IsRes
                                          , CASE WHEN RD.USERSID IS NULL THEN 0 ELSE RD.IsDone END AS IsDone
                                          ,D.Value`))
                              .from('CATEGORY AS C')
                              .leftJoin(db.raw(`CATEGORYGROUP AS CG ON C.CATEGORYGROUPID = CG.CATEGORYGROUPID`))
                              .leftJoin(db.raw(`USERS AS U ON C.TEACHERID = U.USERSID`))
                              .leftJoin(db.raw(`DISCOUNT AS D ON (D.CATEGORYID = C.CATEGORYID
                                                              AND D.ISACTIVE = TRUE
                                                              AND D.FROMDATE <= ?
                                                              AND D.ENDDATE >= ?)`,  [date,date] ))
                              .leftJoin(db.raw(`RESDETAIL AS RD ON C.CATEGORYID = RD.CATEGORYID
                                                              AND RD.USERSID = ?
                                                              AND RD.ISACTIVE = TRUE`, [userid]))
                              .whereRaw('C.ISACTIVE = ?', true)
                              .andWhereRaw(db.raw(`MATCH(CategoryName) AGAINST( '*${keyword}*' IN BOOLEAN MODE)
                                                OR MATCH(CategoryGroupName) AGAINST( '*${keyword}*' IN BOOLEAN MODE)
                                                OR MATCH(DislayName) AGAINST( '*${keyword}*' IN BOOLEAN MODE)`))
    if (categoryList.length === 0) {
      return null;
    }
    return categoryList;
  },

  async getRateDetailByCategoryId(CategoryId) {
    const categoryList = await db.select(db.raw(`U.DislayName
                                                ,U.Image
                                                ,R.RateValue
                                                ,R.Cmt
                                                ,R.RateTime`))
                                .from('RATEDETAIL AS R')
                                .leftJoin(db.raw(`USERS AS U ON R.USERSID = U.USERSID`))
                                .whereRaw(`R.CATEGORYID = ?`,  [CategoryId])
                                .orderBy(`R.RateTime`);
    if (categoryList.length === 0) {
      return null;
    }
    return categoryList;
  },

  async addRateCmt(ratedetail) {
    const ids = await db("RateDetail").insert(ratedetail);
    return ids[0];
  },

  async addLike(likedetail) {
    const id = await db("LikeDetail").whereRaw(`USERSID = ?
                                              AND CATEGORYID = ?`, [likedetail.UsersId, likedetail.CategoryId]);
                                              console.log(id.length);
    if(id.length > 0) {
      return await db("likedetail")
                      .update(likedetail)
                      .whereRaw(`USERSID = ?
                                AND CATEGORYID = ?` , [likedetail.UsersId, likedetail.CategoryId]);
    }  
    else {
      return await db("likedetail").insert(likedetail);
    }                                  
  },

  async delLike(likedetail) {
    const ids = await db("likedetail")
                    .update(likedetail)
                    .whereRaw(`USERSID = ?
                              AND CATEGORYID = ?` , [likedetail.UsersId, likedetail.CategoryId]);
    return ids[0];
  },

  async addRes(ResDetail) {
    const ids = await db("ResDetail").insert(ResDetail);
    return ids[0];
  },

  async updateDoneRes(ResDetail) {
    const ids = await db("ResDetail").update(ResDetail)
                                      .whereRaw(`USERSID = ?
                                      AND CATEGORYID = ?` , [ResDetail.UsersId, ResDetail.CategoryId]);
    return ids[0];
  },

};
