var Jogo = {

    preload: function(){

        // barra animada conforme o loading do jogo
        var barra = this.add.sprite(game.width/2,game.height/2, "loading");
        barra.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(barra);

        // main
        game.load.image("bar", "images/barraForca.png"); // barra de forca de salto
        game.load.image("pedra", "images/pedra.png"); // quadrados de pedra
        game.load.image("chao", "images/chao.png"); // chao
        game.load.image("gameOver","images/gameover.png"); // game over quando heroi colide com morcego ou caixas
        game.load.spritesheet("bat","images/bat.png", 160,91); // morcego
        game.load.image("replay", "images/replay.png"); // botao de replay quando acontece o game over


        game.load.atlasJSONHash('heroi', 'images/explorer.png', 'images/explorer.json');
        game.load.image("background","images/fundo.png"); // backgorund
        game.load.image("moeda","images/moeda.png"); // imagem da moeda
        game.load.image("botaoPausa","images/botao-pausa.png"); // botao pausa

        // sons
        // tiver que usar o software audacity para exportar a musica mp3 e ogg para ser suportada em vários broweser's , por exemplo firefox não suporta mp3
        game.load.audio("musica",["sound/TheFatRat - Xenogenesis .mp3","sound/TheFatRat - Xenogenesis .ogg"]); // load music
        game.load.audio("somMoeda",["sound/somMoeda.mp3","sound/somMoeda.ogg"]); // musica quando o heroi "apanha" uma moeda
        game.load.audio("somMorto",["sound/deadSound.,mp3","sound/deadSound.ogg"]); // musica quando o heroi "morre"
    },

    create: function() {
        // adiciona a musica
        musica = game.add.audio("musica");
        musica.play(); // musica de fundo começa a tocar
        somMoeda = game.add.audio("somMoeda");
        somMorto = game.add.audio("somMorto");

        // variaveis
        this.forca = 0; // "quantidade" de "forca" vamos aplicar ao salto
        pontos=0; // pontos
        highscore = localStorage.getItem("highscore"); // vai buscar o highscore em memoria do broweser


        game.stage.backgroundColor = "#000000"; // fundo do gameover , preto

        //background durante jogo
        this.background=game.add.sprite(0,0,"background");
        this.background.width=game.width;
        this.background.height=game.height;

        // chao
        this.chao=game.add.tileSprite(0,game.height*.9,game.width,50,"chao"); // adiciona o chao , titleSprite porque se repete constantemente
        this.chao.autoScroll(-150,0); // fazer parecer que estamos realmente a correr , ir para a frente , mas é o chao que se movimenta e o "boneco" só faz a animacao de correr


        //heroi
        this.heroi = game.add.sprite(game.width * .2, this.chao.y, "heroi"); // adiciona o heroi

        //animacoes
        // cada animacao tem 5 frames e são percorridos com velocidade de 12
        //this.heroi.animations.add("morre", [10,11,12,13,14], 12, false);
        //this.heroi.animations.add("salta", [5,6,7,8,9], 12, false);
        //this.heroi.animations.add("correr", [0,1,2,3,4], 12 , true);
        //this.heroi.animations.play("correr");

        this.heroi.animations.add("morre", [0,1,2,3,4,5,6,7,8,9], 12, false);
        this.heroi.animations.add("salta", [20,21,22,23,24,25,26,27,28,29], 12, false);
        this.heroi.animations.add("correr", [30,31,32,33,34,35,36,37,38,39], 12, true);
        this.heroi.animations.play("correr");

        this.heroi.width = game.width / 12; // escala de tamanho do  heroi em termos de largura
        this.heroi.scale.y = this.heroi.scale.x; // o tamanho do heroi em x é igual em Y
        this.heroi.anchor.set(0.5, 1);


        //adicionar a barra de força junto a cabeça do  heroi
        this.barraForca = game.add.sprite(this.heroi.x + this.heroi.width / 2, this.heroi.y - this.heroi.height / 2, "bar");
        this.barraForca.width = 0;


        // Comeca o motor de fisicas
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.physics.enable(this.heroi, Phaser.Physics.ARCADE); // aplicar fisicas o heroi
        game.physics.enable(this.chao, Phaser.Physics.ARCADE); // aplicar fisicas ao chao

        this.heroi.body.gravity.y = 250; // gravidade do heroi
        this.heroi.body.collideWorldBounds = true; // heroi colide com os limites do jogo

        this.chao.body.immovable = true; // chao é imovivel, mesmo que objetos lhe toquem ele não se move da posicao

        this.posYHeroi = this.heroi.y; // posicao inicial do heroi em termos de y

        game.input.onDown.add(this.ratoBaixo, this); // fica a espera que o rato seja presionado
        this.pedras = game.add.group(); // grupo de pedras

        this.spawnPedras(); // chama a funcao de criar os blocos de pedra
        this.spawnBat(); // chama funcao de criar o morcego
        this.spawnMoeda(); // chama funcao para criar as moedas

        // texto de pontuacao durante o jogo
        textoPontos = game.add.text(16,16, "Pontuação: 0", { fontSize: "15px", fill: "#00ff26", boundsAlignH: "top", boundsAlignV: "top", align : "left"});

        // Botão pausa
        this.botaoPausa = this.add.button(game.width -12,12,"botaoPausa",this.pausaGame,this);
        this.botaoPausa.anchor.set(1,0);
        this.botaoPausa.input.useHandCursor = true; // o cursor fica com o aspecto de mao

    },

    pausaGame : function(){
        this.game.paused = true;
        mensagemTextoPausa = this.add.text( 350, 240,"                           Pausa\nPressione na area de jogo para continuar",{ fontSize: "18px", fill: "#00ff26", boundsAlignH: "top", boundsAlignV: "top", align : "left"});
        mensagemTextoPausa.anchor.set(0.5,0.5);

        this.input.onDown.add( function (){ // quando rato pressionado
            mensagemTextoPausa.destroy(); // texto desaparece
            this.game.paused= false;
        }, this )
    },

    ratoBaixo: function() {
        if (this.heroi.y != this.posYHeroi) { // se o heroi não está na posicao inicial em y é porque não está no chao entao a funcao nao avança
            return;
        }
        game.input.onDown.remove(this.ratoBaixo, this);
         // enquanto o rato estiver presionado chama a funcao aumentaForca e incrementa a forca , máximo de tempo pressionado é de 1 segundo
        this.tempo = game.time.events.loop(Phaser.Timer.SECOND / 1000, this.aumentaForca, this); // 1 segundo
        game.input.onUp.add(this.ratoCima, this); // chama a ratoCima depois de o rato ser precionado
    },

    ratoCima: function() { // chama a funcao de saltar quando o rato deixa de ser pressionado
        game.input.onUp.remove(this.ratoCima, this);
        this.salta(); //chama a funcao salta onde vai movimentar o boneco
        game.time.events.remove(this.tempo); // remove o tempo
        this.forca = 0; // faz reset a forca
        this.barraForca.width = 0; // faz reset a dimensao da barra
        game.input.onDown.add(this.ratoBaixo, this);  // chama a voltar a funcao anterior para estar pronto para a proxima vez que o rato é precionado
        this.heroi.animations.play("salta"); // faz a animacao de saltar
    },

    aumentaForca: function() {
        this.forca++; // incrementa enquanto rato pressionado
        this.barraForca.width = this.forca; // anima a barra  dependendo da "forca" que aplicamos ao salto
        if (this.forca > 50) { // maximo de "forca" para o salto , para não ser exagerado
            this.forca = 50;
        }
    },

    salta: function() {
        this.heroi.body.velocity.y = -this.forca * 12; // "altura " do salto depende da forca aplicada
    },

    spawnPedras: function() {
       this.pedras.removeAll(); // remove as caixas
        var numeroCaixas = game.rnd.integerInRange(1, 3); // randomizar o numero de caixas entre com o minimo de 1 e maximo de 3
        for (var i = 0; i < numeroCaixas; i++) {
            var pedra = game.add.sprite(0, -i * 50, "pedra"); // -i adiciona as pedras umas em cima das outras empilhadas para cima , *50(cada bloco tem 50 pixeis ) adicionar o bloco seguinte precisamente onde acaba a primeira
            this.pedras.add(pedra); // adiciona os blocos ao grupo
        }

        this.pedras.x = game.width - this.pedras.width; // posicao do x onde elimina os blocos , logo só quando os blocos estão fora do ecra de jogo
        this.pedras.y = this.chao.y - 50; // - 50 porque é o tamanho de cada bloco do chao


        this.pedras.forEach( function(pedra) { // loop, percorre todos os blocos criados e aplica fisicas, gravidade , etc a cada um

            game.physics.enable(pedra, Phaser.Physics.ARCADE); // aplicas as fisicas

            pedra.body.velocity.x = -150;  // velocidade em x ( andar para a esquerda), mesma velocidade que o chao
            pedra.body.gravity.y = 0; // sem gravidade para não cairem do mapa
            pedra.body.immovable = true; // mesmo que o heroi bate contra as pedras não se movem
        });

    },

    spawnMoeda: function(){
        if(this.moeda){
            this.moeda.destroy();
        }
        var moedaY = game.rnd.integerInRange(100, 350); // posicoes aleatorias que a moeda pode tomar
        this.moedaX = game.width + 75;
        this.moeda = game.add.sprite(this.moedaX, moedaY,"moeda"); // spawn da moeda fora do ecra e posicao aleatoria em Y


        game.physics.enable(this.moeda, Phaser.Physics.ARCADE);
        this.moeda.body.velocity.x = -150; // mesma velocidade das caixas
        this.moeda.body.bounce.set(0,0); // sem bounce
        this.moeda.width= game.width * 0.05; // 5% da largura do ecra de jogo
        this.moeda.scale.y=this.moeda.scale.x; // x = y , manter proporcional

    },

    spawnBat: function() {
        // a funcao é chamada quando o morcego sai do ecra e quando comeca para criar um novo
        // se sai do ecra a funcao e chamada e ouver morcego "destroi-a"
        if (this.bat) {
            this.bat.destroy();
        }

        // posiciona o morcego no topo entre 10 a 40 porcento da altura do jogo
        // funcao integerInRange é parecida a funcao random
        var batY = game.rnd.integerInRange(game.height * .1, game.height * .4); // posicao bat em Y random todas as vezes que faz "spawn"

        //adiciona o sprite do morcego
        this.bat = game.add.sprite(game.width + 100, batY, "bat"); // 100 +- largura do morcego , fazer spawn do bat fora do ecra

        this.bat.animations.add("fly",[0,1,2],7,true); // 3 frames e percorridos com velocidade de 7
        this.bat.animations.play("fly");


        game.physics.enable(this.bat, Phaser.Physics.ARCADE); // adiciona fisicas ao morcego
        this.bat.body.velocity.x = -200; // velociade do morcego mais rapida que as caixas

        this.bat.body.bounce.set(2, 2); // "bounce" efeito para o morcego  , para quando o heroi colidir com o morcegoe vai um bocado para tras

        this.bat.width=game.width*.15; //15 % do tamanho jo jogo
        this.bat.scale.y=this.bat.scale.x; // tamanho em altura  e em comprimento iguais

    },


    noChao() { // quando é chamada é porque o boneco está no chao então faz a animacao correr
        if (this.heroi) { // verifica se existe boneco
            this.heroi.animations.play("correr");
        }
    },

    update: function() {

        game.physics.arcade.collide(this.heroi, this.chao, this.noChao,null, this); //quando o heroi colide com o chao chama a funcao a informar que está no chao

        game.physics.arcade.collide(this.heroi, this.pedras, this.atrasaGameOver,null,  this); //quando heroi colide com as colunas , chama gameover

        game.physics.arcade.collide(this.chao, this.pedras,this); // blocos de pedra , colunas , colidem com o chao

        game.physics.arcade.collide(this.pedras,this); // cada bloco de pedra vai colidir com os outros

        game.physics.arcade.collide(this.heroi, this.bat, this.atrasaGameOver,null,  this); // quando heroi colide com o morcego , game over

        game.physics.arcade.overlap(this.heroi, this.moeda, this.acertouMoeda, null, this); // se existe um overlap entre o heroi e a moeda

        game.physics.arcade.collide(this.moeda,this.pedras, this); // moeda colide com os blocos

        game.physics.arcade.overlap(this.moeda, this.pedras, this.moedaPedra,null,this);


        var posPedras = this.pedras.getChildAt(0);  // se a posição do primeiro bloco do grupo está fora do ecra quer dizer que todos estão , então guarda a prosicao do primeiro bloco
        if (posPedras.x < -game.width) {
            this.spawnPedras();
        }

        if (this.bat.x < 0) { // se sai fora do ecra de jogo , "fazemos" um novo morcego
            this.spawnBat(); // chama a funcao do morcego
        }

        if(this.moeda.x < 0){ // se a moeda sair fora do ecra de jogo chama a funcao para criar outra
            this.spawnMoeda();
        }
    },

    moedaPedra : function(){ // se moeda fazer spawn em cima das pedras 
        this.moedaX = this.moedaX + 50;
    },

    acertouMoeda: function(){
        this.moeda.destroy(); // faz "desaparecer" a moeda assim que o heroi a acerta
        pontos +=10;
        textoPontos.text = "Pontuação: " + pontos;
        game.time.events.add(Phaser.Timer.SECOND-900, this.acertouMoedaSom, this); // atrasa um bocado o som para que não aja vários "play" do som ao mesmo tempo
        this.spawnMoeda();
    },

    acertouMoedaSom: function(){
        somMoeda.play();
    },

    atrasaGameOver: function() { // acontece antes do  gameOver
        if (this.heroi) { // se existir heroi
            this.heroi.animations.play("morre"); // acontece a animacao
            somMorto.play();
            musica.stop(); // para a musica , se não aconteceria que a mesma musica tocaria umas por cima das outras sempre que fizemos replay
            somMoeda.stop();// para a musica da moeda
            this.heroi.body.velocity.y = 10; // se morrer a sua velocidade
        }
        // faz "esperar"  antes de chamar a funcao gameover para que se consigua ver a animacao morre
        game.time.events.add(Phaser.Timer.SECOND-200, this.gameOver, this);
    },

    gameOver: function() { // chama a funcao startOver onde tem o ecra com imagem game over e botao replay
        localStorage.setItem("highscore", Math.max(pontos, highscore)); // iguala o highscore ao maior entre os dois
        game.state.start("GameOver");
    },


}
