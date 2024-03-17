import systemRoles from "../../utils/system-roles.js";

const endPointsRoles = {
    ADMIN_SUPER_ADMIN: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER]
}

export default endPointsRoles