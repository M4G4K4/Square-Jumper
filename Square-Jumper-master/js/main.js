var game;
window.onload = function(){

    game=new Phaser.Game(680,460,Phaser.AUTO,"ph_game");

    game.state.add("Inicio", Inicio);
    game.state.add("GameOver", GameOver);
    game.state.add("Jogo", Jogo);
    game.state.start("Inicio", Inicio);
    
}
