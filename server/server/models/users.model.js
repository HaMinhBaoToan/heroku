const db = require("../utils/db");

module.exports = {
  all() {
    return db("users");
  },

  async single(id) {
    const user = await db("users").where("UsersId", id);
    if (user.length === 0) {
      return null;
    }
    return user[0];
  },
  async DetailCategory(id) {
    const user = await db("category").where("CategoryId", id);
    if (user.length === 0) {
      return null;
    }
    return user[0];
  },
  async favoriteCategory(id) {
    var date = new Date();
    const category = await db.select(db.raw(`C.*
                                            ,CG.CategoryGroupName
                                            ,U.DislayName
                                            ,D.Value`))
                              .from(`LIKEDETAIL AS LD`)
                              .leftJoin(db.raw(`CATEGORY AS C ON C.CATEGORYID = LD.CATEGORYID`))
                              .leftJoin(db.raw(`CATEGORYGROUP AS CG ON C.CATEGORYGROUPID = CG.CATEGORYGROUPID`))
                              .leftJoin(db.raw(`USERS AS U ON C.TEACHERID = U.USERSID`))
                              .leftJoin(db.raw(`DISCOUNT AS D ON (D.CATEGORYID = C.CATEGORYID
                                                              AND D.ISACTIVE = TRUE
                                                              AND D.FROMDATE <= ?
                                                              AND D.ENDDATE >= ?)`,  [date,date] ))
                              .whereRaw('LD.ISACTIVE = TRUE')
                              .andWhereRaw(`LD.USERSID = ?`, [id])
    
    return category
  },
  async CategoryUser(id) {
    var date = new Date();
    const category = await db.select(db.raw(`C.*
                                            ,CG.CategoryGroupName
                                            ,U.DislayName
                                            ,1 AS IsRes
                                            ,RD.IsDone
                                            ,D.Value`))
                              .from(`RESDETAIL AS RD`)
                              .leftJoin(db.raw(`CATEGORY AS C ON C.CATEGORYID = RD.CATEGORYID`))
                              .leftJoin(db.raw(`CATEGORYGROUP AS CG ON C.CATEGORYGROUPID = CG.CATEGORYGROUPID`))
                              .leftJoin(db.raw(`USERS AS U ON C.TEACHERID = U.USERSID`))
                              .leftJoin(db.raw(`DISCOUNT AS D ON (D.CATEGORYID = C.CATEGORYID
                                                              AND D.ISACTIVE = TRUE
                                                              AND D.FROMDATE <= ?
                                                              AND D.ENDDATE >= ?)`,  [date,date] ))
                              .whereRaw('RD.ISACTIVE = TRUE')
                              .andWhereRaw(`RD.USERSID = ?`, [id])
    
    return category
  },
  async categoryDetail(id) {
    const category = await db("category").where("CategoryId", id);
    if (category.length <= 0) {
      return null;
    }
    return category;
  },

  async add(user) {
    const ids = await db("users").insert(user);
    return ids[0];
  },

  del(id) {
    return db("users").where("UsersId", id).del();
  },

  update(id, user) {
    return db("users").where("UsersId", id).update(user);
  },

  profile(id) {
    return db("users").where("UsersId", id);
  },
  async updateOTPEmail(email, otp) {
    return db("users").where("Email", email).update("OTP", otp);
  },
  async updateProfile(id, username, email) {
    await db("users").where("UsersId", id).update("Email", email);
    user = await db("users")
      .where("UsersId", id)
      .update("DislayName", username);
    return user[0];
  },
  async singleByEmail(email) {
    const users = await db("users").where("Email", email);

    if (users.length === 0) {
      return null;
    }
    return { ...users[0] };
  },
  async resetPassword(Email, password) {
    var user = await db("users").where({ Email: Email });
    if (user.length === 0) {
      return null;
    } else {
      await db("users").where("Email", Email).update("OTP_Confim", 1);
      user = await db("users")
        .where("Email", Email)
        .update("Password", password);
      return user[0];
    }
  },
  async changePassword(Email, newPassword) {
    var user = await db("users").where({ Email: Email });
    if (user.length === 0) {
      return null;
    } else {
      user = await db("users")
        .where("Email", Email)
        .update("Password", newPassword);
      return user[0];
    }
  },
  async checkOTP(id, OTP) {
    var user = await db("users").where({ UsersId: id, OTP: OTP });
    if (user.length === 0) {
      return null;
    } else {
      await db("users").where("UsersId", id).update("OTP_Confim", 1);
      user = await db("users").where({ UsersId: id, OTP: OTP });
      return user[0];
    }
  },
  async updateOTP(id, OTP) {
    await db("users").where("UsersId", id).update("OTP", OTP);
    const user = await db("users").where("UsersId", id);
    if (user.length === 0) {
      return null;
    } else {
      return user[0];
    }
  },

  updateRefreshToken(id, refreshToken) {
    return db("users").where("UsersId", id).update("rfToken", refreshToken);
  },

  async isValidRefreshToken(id, refreshToken) {
    const list = await db("users")
      .where("UsersId", id)
      .andWhere("rfToken", refreshToken);
    if (list.length > 0) {
      return true;
    }

    return false;
  },
};
