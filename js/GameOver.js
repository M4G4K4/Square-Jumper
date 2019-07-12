var GameOver={

    create:function( )
    {

        this.replay=game.add.sprite(game.width/2,game.height - 100,"replay"); // sprite botão play again
        this.replay.anchor.set(0.5,0.5); // ponto de referencia da imagem no seu centro e nao nos cantos

        this.replay.inputEnabled=true; // ativar para ser um butao
        this.replay.events.onInputDown.add(this.restartGame,this); // se for pressionada chama a funcao main do jogo e assim recomeca

        this.gameover = game.add.sprite(game.width/2,game.height/2 -100,"gameOver"); // sprite de game over
        this.gameover.anchor.set(0.5,0.5); // ponto de referencia da imagem no seu centro e nao nos cantos

        textoPontuacao = game.add.text(game.width/2 - 40,game.height/2, "Pontos: " + pontos,  { fontSize: "15px", fill: "#00bbff", boundsAlignH: "top", boundsAlignV: "top", align : "left"});

        highscore = localStorage.getItem("highscore"); // recebe o highscore
        textoHighscore = game.add.text(game.width/2 - 50, game.height /2 + 30, "Highscore: " + highscore, { fontSize: "15px", fill: "#00bbff", boundsAlignH: "top", boundsAlignV: "top", align : "left"});
    },
    restartGame:function()
    {
    	game.state.start("Jogo"); // recomeça o jogo por chamar a funcao main
    },
}
