import Model from "../../../models";

const SeedData = async () => {
    try {
        const user_model = Model.User;
        const role_model = Model.Roles;

        // Create User
        const save_user = {
            firstName: "User",
            lastName: "User",
            email: "user@example.com",
            username: "user",
            password: "P@SSw0rd",
            isEmailVerified: true
        }

        const email_exist = await user_model.exists({ email: save_user.email })
        if (email_exist) {
            return
        }

        const username_exist = await user_model.exists({ email: save_user.username })
        if (username_exist) {
            return
        }

        const user = await user_model.create({...save_user});

        const save_role = {
            userId: user._id,
            role: "user",
        }

        await role_model.create({...save_role})

        console.log("Seed data created successfully");

    } catch (error) {
        console.log(`Error seeding data: ${error}`);
        
    }
}

export default SeedData;