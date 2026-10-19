import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const arquivo = path.join(path.dirname(fileURLToPath(import.meta.url)), '../config/itens.json');
const campos = ["titulo", "tipo", "genero", "ano", "sinopse", "diretor", "temporadas", "nota", "imagem"];
const obrigatorios = ["titulo", "tipo", "genero", "ano"];

function ler() {
  const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
  if (!Array.isArray(dados)) throw new Error('O arquivo de dados precisa conter uma lista.');
  return dados;
}
function salvar(dados) {
  const temporario = `${arquivo}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(temporario, JSON.stringify(dados, null, 2) + '\n', 'utf8');
    fs.renameSync(temporario, arquivo);
  } finally {
    if (fs.existsSync(temporario)) fs.unlinkSync(temporario);
  }
}
function idValido(valor) {
  if (!/^[1-9]\d*$/.test(valor)) return null;
  const id = Number(valor);
  return Number.isSafeInteger(id) ? id : null;
}
function validar(body, atualizacao = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Envie um objeto JSON válido.';
  if (Object.keys(body).some(c => !campos.includes(c))) return 'O corpo contém campos desconhecidos ou o campo id, que é automático.';
  if (!atualizacao && obrigatorios.some(c => body[c] === undefined || body[c] === null || body[c] === '')) return `Campos obrigatórios: ${obrigatorios.join(', ')}.`;
  if (atualizacao && Object.keys(body).length === 0) return 'Informe pelo menos um campo para atualizar.';
  const strings = ["titulo", "tipo", "genero", "sinopse", "diretor", "imagem"];
  for (const campo of strings) {
    if (body[campo] !== undefined && (typeof body[campo] !== 'string' || !body[campo].trim())) return `O campo ${campo} deve ser um texto não vazio.`;
  }
  for (const campo of ["ano", "temporadas", "nota"]) {
    if (body[campo] === undefined || body[campo] === null) continue;
    if (typeof body[campo] !== 'number' || !Number.isFinite(body[campo])) return `O campo ${campo} deve ser numérico.`;
  }
  if (body.tipo !== undefined && !['filme', 'serie'].includes(body.tipo)) return 'Tipo deve ser filme ou serie.';
  if (body.ano !== undefined && (!Number.isInteger(body.ano) || body.ano < 1888)) return 'Ano deve ser um inteiro a partir de 1888.';
  if (body.temporadas !== undefined && body.temporadas !== null && (!Number.isInteger(body.temporadas) || body.temporadas < 1)) return 'Temporadas deve ser um inteiro maior que zero.';
  if (body.nota !== undefined && (body.nota < 0 || body.nota > 10)) return 'Nota deve estar entre 0 e 10.';
  return null;
}
function tratarErro(res, erro) {
  console.error('Erro ao acessar os dados:', erro);
  return res.status(500).json({ status: 500, message: 'Erro interno ao acessar os dados.' });
}
function getAll(req, res) {
  try { return res.status(200).json({ status: 200, message: 'Lista consultada com sucesso.', data: ler() }); }
  catch (erro) { return tratarErro(res, erro); }
}
function getById(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ status: 400, message: 'ID inválido.' });
  try {
    const item = ler().find(x => Number(x.id) === id);
    if (!item) return res.status(404).json({ status: 404, message: 'Registro não encontrado.' });
    return res.status(200).json({ status: 200, data: item });
  } catch (erro) { return tratarErro(res, erro); }
}
function create(req, res) {
  const erroValidacao = validar(req.body);
  if (erroValidacao) return res.status(400).json({ status: 400, message: erroValidacao });
  try {
    const dados = ler();
    const novoId = Math.max(0, ...dados.map(x => Number(x.id) || 0)) + 1;
    const novo = { id: novoId, ...Object.fromEntries(campos.filter(c => req.body[c] !== undefined).map(c => [c, req.body[c]])) };
    dados.push(novo);
    salvar(dados);
    return res.status(201).json({ status: 201, message: 'Registro criado.', data: novo });
  } catch (erro) { return tratarErro(res, erro); }
}
function update(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ status: 400, message: 'ID inválido.' });
  const erroValidacao = validar(req.body, true);
  if (erroValidacao) return res.status(400).json({ status: 400, message: erroValidacao });
  try {
    const dados = ler();
    const indice = dados.findIndex(x => Number(x.id) === id);
    if (indice < 0) return res.status(404).json({ status: 404, message: 'Registro não encontrado.' });
    const atualizado = { ...dados[indice], ...req.body, id };
    if (obrigatorios.some(c => atualizado[c] === undefined || atualizado[c] === null || atualizado[c] === '')) return res.status(400).json({ status: 400, message: 'Campos obrigatórios não podem ser removidos.' });
    dados[indice] = atualizado;
    salvar(dados);
    return res.status(200).json({ status: 200, message: 'Registro atualizado.', data: atualizado });
  } catch (erro) { return tratarErro(res, erro); }
}
function remove(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ status: 400, message: 'ID inválido.' });
  try {
    const dados = ler();
    const indice = dados.findIndex(x => Number(x.id) === id);
    if (indice < 0) return res.status(404).json({ status: 404, message: 'Registro não encontrado.' });
    const [removido] = dados.splice(indice, 1);
    salvar(dados);
    return res.status(200).json({ status: 200, message: 'Registro excluído.', data: removido });
  } catch (erro) { return tratarErro(res, erro); }
}

export default {
  getAllItens: getAll,
  getItemById: getById,
  createItem: create,
  updateItem: update,
  deleteItem: remove
};
