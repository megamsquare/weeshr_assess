import Model from "../models";
import { NewRole } from "../dto/obj/role.dto";

async function createRole(role: NewRole) {
    try {
        const roleModel = Model.Roles;

        const roles = await getRolesByUserId(role.userId);

        const isRoleExist = roles?.includes(role.role);
        if (isRoleExist) {
            throw new Error("user already have this role");
        }

        const savedRole = await roleModel.create({ ...role });

        return savedRole

    } catch (error) {
        return error as Error
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
        return error as Error
    }
}

async function getRolesByUserId(userId: string) {
    try {
        const roleModel = Model.Roles;

        const rolesByUserId = await roleModel.find({ userId: userId });
        const roles = rolesByUserId?.map((role) => role.role);

        return roles;
    } catch (error) {
        console.log(error)
    }
}

const RoleService = {
    createRole,
    getRoleById,
    getRolesByUserId
}

export default RoleService;