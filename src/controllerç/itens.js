import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const arquivoItens = path.join(
  __dirname,
  '../config/itens.json'
);

function lerItens() {

  const dados = fs.readFileSync(
    arquivoItens,
    'utf-8'
  );

  return JSON.parse(dados);
}

function salvarItens(itens) {

  fs.writeFileSync(
    arquivoItens,
    JSON.stringify(itens, null, 2)
  );

}

 // CRUD - Create, Read, Update, Delete
 // Read - GET todos os itens
function getAllItens(req, res) {
  try {
    const itens = lerItens();

    return res.status(200).json({
      status: 200,
      message: 'Itens encontrados.',
      data: itens
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: 500,
      message: 'Erro ao carregar itens.'
    });
  }
}

// Read - GET item por ID
function getItemById(req, res) {
  try {
    const id = Number(req.params.id);
    const itens = lerItens();

    const item = itens.find(
      item => item.id === id
    );

    if (!item) {
      return res.status(404).json({
        status: 404,
        message: 'Item não encontrado.'
      });
    }

    return res.status(200).json({
      status: 200,
      data: item
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Erro interno.'
    });
  }
}

// Create - POST criar novo item
function createItem(req, res) {
  try {

    const {
      nome,
      descricao,
      categoria,
      imagem,
      quantidade,
      preco
    } = req.body;


    // Validação dos campos obrigatórios
    if (
      !nome ||
      !categoria ||
      !imagem ||
      quantidade === undefined ||
      preco === undefined
    ) {

      return res.status(400).json({
        status: 400,
        message: 'Preencha os campos obrigatórios.'
      });

    }


    // Busca os itens que já existem
    const itens = lerItens();


    // Cria um novo ID
    const novoId =
      itens.length > 0
        ? Math.max(...itens.map(item => item.id)) + 1
        : 1;


    // Pega a data atual
    const agora = new Date().toISOString();


    // Cria o novo objeto
    const novoItem = {
      id: Number,
      tituo:  string,
      descricao: descricao || '',
      tido: categoria.toLowerCase(),
      imagem: imagem,
      genero:
      ano: ,
      preco: Number(preco),
      data_criacao: agora,
      data_atualizacao: agora
    };


    // Adiciona o novo item no array
    itens.push(novoItem);


    // Salva novamente no JSON
    salvarItens(itens);


    // Retorna o item criado
    return res.status(201).json({
      status: 201,
      message: 'Item criado com sucesso.',
      data: novoItem
    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      status: 500,
      message: 'Erro ao criar item.'
    });

  }
}


// Update - PUT atualizar item

function updateItem(req, res) {
  try {

    // Pega o ID da URL
    const id = Number(req.params.id);


    // Lê os itens
    const itens = lerItens();


    // Procura a posição do item
    const index = itens.findIndex(
      item => item.id === id
    );


    // Se não encontrar
    if (index === -1) {

      return res.status(404).json({
        status: 404,
        message: 'Item não encontrado.'
      });

    }


    // Dados enviados pelo usuário
    const {
      nome,
      descricao,
      categoria,
      imagem,
      quantidade,
      preco
    } = req.body;


    // Atualiza o item
    itens[index] = {

      // Mantém os dados antigos
      ...itens[index],

      // Atualiza somente o que foi enviado

      nome:
        nome !== undefined
          ? nome
          : itens[index].nome,

      descricao:
        descricao !== undefined
          ? descricao
          : itens[index].descricao,

      categoria:
        categoria !== undefined
          ? categoria.toLowerCase()
          : itens[index].categoria,

      imagem:
        imagem !== undefined
          ? imagem
          : itens[index].imagem,

      quantidade:
        quantidade !== undefined
          ? Number(quantidade)
          : itens[index].quantidade,

      preco:
        preco !== undefined
          ? Number(preco)
          : itens[index].preco,

      data_atualizacao:
        new Date().toISOString()
    };


    // Salva no JSON
    salvarItens(itens);


    // Retorna o item atualizado
    return res.status(200).json({
      status: 200,
      message: 'Item atualizado com sucesso.',
      data: itens[index]
    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      status: 500,
      message: 'Erro ao atualizar item.'
    });

  }
}


// Delete - DELETE remover item

function deleteItem(req, res) {
  try {

    // Pega o ID da URL
    const id = Number(req.params.id);


    // Lê os itens
    const itens = lerItens();


    // Procura a posição do item
    const index = itens.findIndex(
      item => item.id === id
    );


    // Se não encontrar
    if (index === -1) {

      return res.status(404).json({
        status: 404,
        message: 'Item não encontrado.'
      });

    }


    // Remove o item
    const itemRemovido = itens.splice(index, 1)[0];


    // Salva o novo array
    salvarItens(itens);


    // Retorna o item removido
    return res.status(200).json({
      status: 200,
      message: 'Item removido com sucesso.',
      data: itemRemovido
    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      status: 500,
      message: 'Erro ao excluir item.'
    });

  }
}


// Exporta todas as funções do controller

export default {
  getAllItens,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};