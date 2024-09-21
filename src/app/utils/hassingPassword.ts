import bcrypt from 'bcrypt'

const hashingPassword = async (plainPassword) => {
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(plainPassword, salt)
    return hashedPassword
}

export const verifyPassword = async (plainPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword)
    return isMatch
}

export default hashingPassword
