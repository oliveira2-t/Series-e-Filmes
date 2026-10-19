import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { app } from '../server.js';
const arquivo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/config/itens.json');
const inicial = fs.readFileSync(arquivo, 'utf8');
const raiz = "/api/itens";
const entrada = {"titulo": "Filme de exemplo", "tipo": "filme", "genero": "Drama", "ano": 2024, "sinopse": "Filme fictício usado como exemplo.", "diretor": "Diretor Exemplo", "temporadas": null, "nota": 8.2, "imagem": "https://example.com/filme.jpg"};

test('CRUD completo, erros e Swagger', async () => {
  const servidor = app.listen(0);
  await new Promise(resolve => servidor.once('listening', resolve));
  const url = `http://127.0.0.1:${servidor.address().port}`;
  const chamar = (rota, opcoes) => fetch(url + rota, opcoes);
  try {
    let r = await chamar(raiz); assert.equal(r.status, 200);
    assert.ok(Array.isArray((await r.json()).data));
    r = await chamar(raiz + '/abc'); assert.equal(r.status, 400);
    r = await chamar(raiz + '/999999'); assert.equal(r.status, 404);
    r = await chamar(raiz, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }); assert.equal(r.status, 400);
    r = await chamar(raiz, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(entrada) }); assert.equal(r.status, 201);
    const criado = (await r.json()).data;
    r = await chamar(raiz + '/' + criado.id); assert.equal(r.status, 200);
    r = await chamar(raiz + '/' + criado.id, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ titulo: "Atualizado" }) }); assert.equal(r.status, 200);
    r = await chamar(raiz + '/' + criado.id, { method: 'DELETE' }); assert.equal(r.status, 200);
    r = await chamar(raiz + '/' + criado.id); assert.equal(r.status, 404);
    r = await chamar('/api-docs/'); assert.equal(r.status, 200);
  } finally {
    fs.writeFileSync(arquivo, inicial);
    await new Promise(resolve => servidor.close(resolve));
  }
});
