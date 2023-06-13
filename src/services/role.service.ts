import Model from "../models";
import Err from "../use_cases/error_handler";
import { NewRole } from "../use_cases/obj/user.case";

async function createRole(role: NewRole) {
    try {
        const roleModel = Model.Roles;

        const getUserRole = getRoleByUserId(role.userId);

        const savedRole = await roleModel.create({ ...role });

    } catch (error) {

    }
}

async function getRoleById(id: string) {
    try {
        const roleModel = Model.Roles;

        const roleById = await roleModel.findById(id);

        if (!roleById) {
            throw new Error('No role with these id');
        }

        return roleById;
    } catch (error) {

    }
}

async function getRoleByUserId(userId: string) {
    try {
        const roleModel = Model.Roles;

        const rolesByUserId = await roleModel.find({userId: userId});

        return rolesByUserId;
   } catch (error) {
    console.log(error)
    }
}

const RoleService = {
    createRole,
    getRoleById,
    getRoleByUserId
}

export default RoleService;