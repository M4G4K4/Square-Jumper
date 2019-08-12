var Inicio={

    preload:function(){

        game.load.image("loading", "images/loading.png"); // barra de loading

        // Ecra inicial
        game.load.image("background","images/fundo.png"); // backgorund
        game.load.image("playGame","images/play_game.png"); // play game botao
        game.load.image("squarejumper","images/squarejumper.png"); // logo do jogo
        game.load.image("loading", "images/loading.png"); // barra de loading
        game.load.image("ei","images/logo_eng.informatica.png"); // logo de engenharia informatica
        game.load.image("ipvc","images/logo_ipvc.png"); // logo ipvc

    },

    create:function()
    {
        // ajustar o ecra de jogo conforme o "tamanho" do browser
        this.scale.scaleMode                = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally    = true;

        // background ecra inicial
        this.background=game.add.sprite(0,0,"background");
        this.background.width=game.width;
        this.background.height=game.height;

        // "logo " jogo
        this.squarejumper=game.add.sprite(game.width/2,game.height - 300,"squarejumper"); // sprite botão play again
        this.squarejumper.anchor.set(0.5,0.5); // ponto de referencia da imagem no seu centro e nao nos cantos

        // botão play game
        this.playGame=game.add.sprite(game.width/2,game.height - 100,"playGame"); // sprite botão play again
        this.playGame.anchor.set(0.5,0.5); // ponto de referencia da imagem no seu centro e nao nos cantos

        this.playGame.inputEnabled=true; // ativar para ser um butao
        this.playGame.events.onInputDown.add(this.startGame,this); // se for pressionada chama a funcao main do jogo e assim recomeca

        // logo engenharia informatica canto superior esquerdo
        this.eiLogo = game.add.sprite(50,50,"ei");
        this.eiLogo.anchor.set(0.5,0.5); // centro no meio da imagem
        this.eiLogo.scale.set(0.4,0.4); // metade do tamanho da imagem inicial

        // logo ipvc canto superior direito
        this.ipvcLogo = game.add.sprite(game.width - 50 , 50 ,"ipvc");
        this.ipvcLogo.anchor.set(0.5,0.5);
        this.ipvcLogo.scale.set(0.5,0.5);

        // pequeno texto tutorial
        textoInstrucoes = game.add.text(game.width/2 - 100,game.height/2 +50, "Pressione o rato para saltar", { fontSize: "15px", fill: "#00ff26", boundsAlignH: "top", boundsAlignV: "top", align : "left"});

        // meu nome e numero
        textoAluno = game.add.text(game.width/2 - 70 ,game.height - 20 , "By  Pedro Dias    Nº 18482", { fontSize: "12px", fill: "#00ff26", boundsAlignH: "top", boundsAlignV: "top", align : "left"});

    },

    startGame:function(){   
    	game.state.start("Jogo"); // chama a funcao main para começar o jogo

    },

}
