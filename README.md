# Backend Filmes e Séries

Projeto independente, feito com Node.js, Express e Swagger, com a mesma arquitetura básica do Projeto-Final fornecido.

## Requisitos
Node.js 18 ou superior e npm.

## Como executar
```powershell
npm.cmd install
npm.cmd start
```
No PowerShell do Windows, `npm.cmd` contorna o bloqueio de execução do arquivo `npm.ps1` sem mudar a política de segurança.

API: http://localhost:3002/api/itens

Swagger: http://localhost:3002/api-docs

Para executar com reinício automático: `npm.cmd run dev`.

Para testar: `npm.cmd test`.

## Endpoints
| Método | URL | Ação |
|---|---|---|
| GET | /api/itens | Listar todos |
| GET | /api/itens/:id | Buscar por ID |
| POST | /api/itens | Criar |
| PUT | /api/itens/:id | Atualizar campos |
| DELETE | /api/itens/:id | Excluir |

Exemplo de corpo para POST:
```json
{
  "titulo": "Filme de exemplo",
  "tipo": "filme",
  "genero": "Drama",
  "ano": 2024,
  "sinopse": "Filme fictício usado como exemplo.",
  "diretor": "Diretor Exemplo",
  "temporadas": null,
  "nota": 8.2,
  "imagem": "https://example.com/filme.jpg"
}
```

Para PUT, envie somente os campos que deseja alterar. O ID é gerado automaticamente e não deve ser enviado. Os registros estão em `src/config/itens.json`, com dados fictícios iniciais que podem ser substituídos. GET devolve `data: []` quando não há registros. Respostas incluem códigos HTTP 200, 201, 400, 404 e 500.

**Observação:** a persistência em JSON é adequada para projetos de estudo, mas não foi projetada para gravações concorrentes em produção. Não possui autenticação nem banco de dados externo.
