# RemMed (Remembering Medicine)

Projeto feito como Trabalho de Conclusão de Curso no ano de 2025 pela Unicesumar.

<br>

A seguir será demonstrado o processo para configuração do remmed-api em um ambiente com Docker.

### 1) Passo
Configure o arquivo <code>.env</code> na raiz do projeto backend(remmed-api), você tem como base o <code>.env.example</code>

### 2) Passo
Na raiz do projeto existe uma pasta chamada <b>ngrok</b>. Acesse ela.

Crie uma cópia do arquivo <code>ngrok.example.yml</code> com o nome: <code>ngrok.yml</code>, adicione nele seu <b>authtoken</b> fornecido pelo Ngrok, sem isso não será possível integrar a API com o APP(Mobile) em ambiente de desenvolvimento.

Se não possuir conta no Ngrok acesse-o a partir do link: https://ngrok.com/

### 3) Passo
Considerando que você possui o Docker Compose, vamos executar o seguinte comando na raiz do projeto (onde está presente o arquivo <code>docker-compose.yml</code>).
```
docker compose up -d --build
```

Este comando iniciará dois containers, o <code>api</code> e o <code>ngrok</code> onde será estará disponível o domínio público da sua API.

### 5) Passo
Configuração concluída, você já pode testar a API no domínio público fornecido pelo Ngrok.

### Extra
Para executar os testes com o container em execução, use o seguinte comando no terminal:
```
docker exec -it remmed-api npm run test
```