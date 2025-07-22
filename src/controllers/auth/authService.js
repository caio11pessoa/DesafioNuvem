
const validationResult = (nome, email, senha) => {

    if (!nome || !email || !senha) {
        return 'Todos os campos são obrigatórios'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Email inválido'
    }

    if (senha.length < 8) {
        return 'A senha deve ter pelo menos 8 caracteres'
    }

    return ""
}

const validatonLogin = (email, senha) => {

    if (!email || !senha) {
        return 'Todos os campos são obrigatórios'
    }

    return ""
}

module.exports = {validationResult, validatonLogin}