import { systemRoles } from "../../utils/system.roles.js";
export const categoryApisEndpoints={
    create_category:[systemRoles.ADMIN,systemRoles.SUPERADMIN]
}