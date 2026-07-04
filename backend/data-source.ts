// src/data-source.ts

import { DataSource } from "typeorm";
import { User } from "./entities/User.js";
import { Category } from "./entities/Category.js";
import { Admin } from "./entities/Admin.js";
import { RolePermission } from "./entities/RolePermission.js";
import { Permission } from "./entities/Permission.js";
import { ArtistRequest, ArtistRequestRejectedReason } from "./entities/ArtistRequest.js";
import { ArtistPortfolio } from "./entities/ArtistPortfolio.js";
import { Payment } from "./entities/Payment.js";
import { Support } from "./entities/Support.js";
import { configs } from "./config/configs.js";
import { FAQ } from "./entities/FAQ.js";
import { AboutUs } from "./entities/AboutUs.js";
import { Banner } from "./entities/Banner.js";
import { Tutorial } from "./entities/Tutorial.js";

export default new DataSource({
  type: "postgres",
  url: configs.dbUrl,
  synchronize: true,
  logging: false,
  entities: [
    User,
    Category,
    Admin,
    RolePermission,
    Permission,
    ArtistRequest,
    ArtistPortfolio,
    Payment,
    Support,
    FAQ,
    AboutUs,
    ArtistRequestRejectedReason,
    Banner,
    Tutorial
  ],
});