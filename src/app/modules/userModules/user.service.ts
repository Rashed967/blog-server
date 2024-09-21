import { User } from './user.model'

// create user in db
const createUserInDB = async (user) => {
    const result = await User.create(user)

    return result
}

// get profile by id
const getUserProfileByIdFromDb = async (id: string) => {
    const user = User.findOne({ id: id }).select('name email imageUrl')
    return user
}

// update profile by id in db
const updateProfileByIdInDb = async (id, dataToBeUpdated) => {
    try {
        const result = await User.findOneAndUpdate(
            { id: id },
            { ...dataToBeUpdated },
            { new: true }
        ).select('name email imageUrl id _id')
        return result
    } catch (error) {
        throw new Error('Someting went wrong')
    }
}

// get all users (only admin)
const getAllUserFromDb = async () => {
    const result = await User.find()
    return result
}

export const userServices = {
    createUserInDB,
    getUserProfileByIdFromDb,
    updateProfileByIdInDb,
    getAllUserFromDb,
}
