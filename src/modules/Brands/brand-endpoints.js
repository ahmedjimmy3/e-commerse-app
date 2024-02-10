import systemRoles from "../../utils/system-roles.js";

const endPointsRoles = {
    GENERAL_BRAND: [systemRoles.ADMIN],
    ADMIN_SUPER_ADMIN: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN]
}

export default endPointsRoles