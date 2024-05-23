# E-vent

Um aplicativo / website criado para organizar e criar eventos.

### 💡 Funcionalidades

* Criação, acesso, edição e recuperação de senha de conta de usuário;
* Criação, edição e deleção de eventos;
* Aba para todos os eventos disponíveis e outra para eventos apenas que o usuário criou;
* O dono do evento pode acessar as informações dos participantes, assim como marcar se aquele usuário participou do
evento ou não, ou, remover o participante do seu evento;
* O dono do evento pode gerar relatórios em PDF, que mostrarão a lista dos participantes com seus dados de
contato e se ele estava presente no evento ou não.

### 📋 Pré-requisitos

* Você deve ter o Ionic instalado em sua máquina, juntamente com um banco de dados novo criado no Firebase;
* Caso queira buildar uma versão APK, também será necessário ter o Android Studio instalado (opicional).

### 🔧 Instalação

Se quiser executar através do seu editor de código:

* Instale em sua máquina o NodeJS, que pode ser obtido aqui: https://nodejs.org/en/download;
* Instale também o Android Studio, que pode ser obtido em: https://developer.android.com/studio (opicional);
* Após ter instalado o NodeJS, abra seu CMD (Prompt de comando) e execute o seguinte comando: npm install -g @ionic/cli, e aguarde
a instalação ser concluída;
* Após a instalação do Ionic, baixe esse repositório, abra o diretório onde você baixou ele no seu CMD e digite o comando "npm install"
para instalar as dependências do projeto;
* Devido a um erro nos arquivos do firebase, será preciso corrigir um problema manualmente: Abra o arquivo "TProblem.txt" e copie o
conteúdo dentro do mesmo. Após isso vá até "node_modules/@angular/fire/compat/database/interfaces.d.ts" e substitua TODO o conteúdo
dentro deste arquivo pelo copiado do arquivo "TProblem.txt";
* Após a instalação das dependências abra a pasta do projeto no seu editor de código (VSCode, por exemplo), e execute o comando 
"ionic serve" no terminal para iniciar o servidor de desenvolvimento;
* Após isso, abra o navegador e digite "localhost:8100" para acessar o aplicativo;
* Vá até o Firebase crie um novo banco de dados, habilitando um aplicativo WEB, copie os dados de autenticação e substitua os dados
presentes no arquivo ../src/environments/environments.prod.ts
* Habilite as opções "Firestore", "Storage" e "Authentication" no seu Firebase;
* Pronto, você já pode testar o projeto.

Caso queira gerar um APK de teste:

* Abra seu CMD (Prompt de comando) no diretório do projeto, e execute os comandos "npx cap add android" e "npx cap open android",
se tiver instalado corretamente, seu Android Studio deverá abrir;
* Após a abertura do Android Studio, ache a opção "build" e a execute, na versão que utilizei quando o projeto foi criado,
ela ficava no canto inferior esquerdo, com um símbolo de martelo;
* Após a finalização da build, procure a opção "Build Bundle(s) / APK(s)" -> "Build APK(s)", na versão que utilizei quando o 
projeto foi criado, ele ficava em três barras no canto superior esquerdo -> "Build" -> "Build Bundle(s) / APK(s)" -> "Build APK(s)";
* Espere a finalização do processo, após a finalização, irá aparecer uma mensagem no canto inferior direito, com uma opção chamada 
"locate", clique-á e abra a pasta "debug", dentro dela haverá o APK, pode renomeá-lo, enviá-lo ao seu dispositivo Android, instalá-lo
e executá-lo.

Se quiser apenas testar o projeto, ele está hospedado em "e-vent-99a91.web.app", assim como possui um aplicativo presente
na Play Store (em breve);

## ⚙️ Executando os testes

Você pode testar o aplicativo como um todo, desde criação e login de contas, criação de eventos, participação em eventos, remoção de participantes dos seus eventos, visualização dos detalhes dos participantes, geração de relatórios do evento, edição do perfil próprio, entre outros. Vá em frente e explore.

## 🛠️ Construído com

* [Ionic](https://ionicframework.com/docs/intro/cli) - Framework utilizado
* [Firebase](firebase.google.com) - Banco de dados utilizado

## 📌 Versão

Beta 1.9

## ✒️ Autores

* **Elian R. Ribeiro** - *Desenvolvedor* - [elian-r-ribeiro](https://github.com/elian-r-ribeiro)

## 🎫 Observações

* Não comercialize, utilize de forma pública ou publique este projeto como se fosse seu, ou sem autorização do dono do mesmo.