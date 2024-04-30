# E-vent

Um aplicativo / website criado para organizar e criar eventos.

### 📋 Pré-requisitos

Você deve ter o Ionic instalado em sua máquina, juntamente com um banco de dados novo criado no Firebase.

### 🔧 Instalação

Se quiser executar através do seu editor de código:

-Instale em sua máquina o NodeJS, que pode ser obtido aqui: https://nodejs.org/en/download;
-Após ter instalado o NodeJS, abra seu CMD (Prompt de comando) e execute o seguinte comando: npm install -g @ionic/cli, e aguarde
a instalação ser concluída;
-Após a instalação do Ionic, baixe esse repositório, abra o diretório onde você baixou ele no seu CMD e digite o comando "npm install"
para instalar as dependências do projeto;
-Após a instalação das dependências abra a pasta do projeto no seu editor de código (VSCode, por exemplo), e execute o comando 
"ionic serve" no terminal para iniciar o servidor de desenvolvimento;
-Após isso, abra o navegador e digite "localhost:8100" para acessar o aplicativo;
-Vá até o Firebase crie um novo banco de dados, habilitando um aplicativo WEB, copie os dados de autenticação e substitua os dados
presentes no arquivo ../src/environments/environments.prod.ts
-Habilite as opções "Firestore", "Storage" e "Authentication" no seu Firebase;
-Pronto, você já pode testar o projeto.

Se quiser apenas testar o projeto, ele está hospedado em "e-vent-99a91.web.app", assim como possui um aplicativo presente
na Play Store (em breve);

## ⚙️ Executando os testes

Você pode testar o aplicativo como um todo, desde criação e login de contas, criação de eventos, participação em eventos, remoção de participantes dos seus eventos, visualização dos detalhes dos participantes, geração de relatórios do evento, edição do perfil próprio,
entre outros. Vá em frente e explore.

## 🛠️ Construído com

* [Ionic](https://ionicframework.com/docs/intro/cli) - Framework utilizado
* [Firebase](firebase.google.com) - Banco de dados utilizado

## 📌 Versão

Beta 1.0

## ✒️ Autores

* **Elian R. Ribeiro** - *Desenvolvedor* - [elian-r-ribeiro](https://github.com/elian-r-ribeiro)