import systemRoles from "../../utils/system-roles.js";

const endpointRoles = {
    ADD_PRODUCT : [systemRoles.ADMIN,systemRoles.SUPER_ADMIN]
}

export default endpointRoles