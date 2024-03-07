import systemRoles from "../../utils/system-roles.js"

const endPointsRoles ={
    MAKE_OR_CANCEL_ORDER:[systemRoles.USER],
    DELIVERED_ORDER:[systemRoles.DELIVERY_ROLE],
    REFUND:[systemRoles.ADMIN,systemRoles.SUPER_ADMIN]
}

export default endPointsRoles