const prisma = require('../../../prisma/client');
const bcrypt = require('bcrypt');
const { validationResult, validatonLogin } = require('./auth.service')
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { nome, email, senha } = req.body;

  const error = validationResult(nome, email, senha);

  if (error != "") {
    res.status(400).json({ error });
  }

  try {
    const senha_hash = await bcrypt.hash(senha, 10);
    const user = await prisma.user.create({
      data: { nome, email, senha_hash },
    });

    res.status(201).json({ message: 'Usuário registrado com sucesso', userId: user.id });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao registrar usuário', details: error.message });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  const error = validatonLogin(email, senha)

  if (error != "") {
    res.status(400).json({ error });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);

    if (!senhaCorreta) return res.status(401).json({ error: 'Credenciais inválidas 2' });

    const token = jwt.sign({ userId: user.id }, "teste", {
      expiresIn: '1d',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

const me = async (req, res) => {
  const { userId } = req;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, nome: true, email: true },
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar informações do usuário' });
  }
};

module.exports = {
  register,
  login,
  me,
};
