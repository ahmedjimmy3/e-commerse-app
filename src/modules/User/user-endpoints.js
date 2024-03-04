import systemRoles from "../../utils/system-roles.js";

const endpointRoles = {
    GENERAL_USAGE : [systemRoles.ADMIN,systemRoles.SUPER_ADMIN,systemRoles.USER,systemRoles.DELIVERY_ROLE]
}

export default endpointRoles