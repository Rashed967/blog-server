import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import config from '../config'

function generateToken(user) {
    const token = jwt.sign({ username: user.name, role: user.role, id: user.id, }, config.secret_key as string, {
        expiresIn: '1h',
    })
    return token
}

export const jwtToken = {
    generateToken,
}
