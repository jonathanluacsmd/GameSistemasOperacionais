class menu extends Phaser.Scene {
    constructor (){
        super({key: 'menu'});
    }

    preload() {
        this.load.spritesheet('menuprocessos', 'img/menuprocessos.png', {frameWidth: 335, frameHeight: 70});
        this.load.spritesheet('menumemoria', 'img/menumemoria.png', {frameWidth: 284, frameHeight: 70});
        this.load.spritesheet('menudispositivos', 'img/menudispositivos.png', {frameWidth: 388, frameHeight: 70});
        this.load.spritesheet('menuarquivos', 'img/menuarquivos.png', {frameWidth: 298, frameHeight: 70});
        this.load.spritesheet('menucreditos','assets/botaoCREDITOS.png',{frameWidth:227,frameHeight:40});
        
    }
    create() {
        var imagemprocessos = this.add.sprite(400,150, 'menuprocessos').setInteractive();
        var imagemmemoria = this.add.image(400,250, 'menumemoria').setInteractive();
        var imagemarquivos = this.add.image(400,350, 'menuarquivos').setInteractive();
        var imagemdispositivos = this.add.image(400,450, 'menudispositivos').setInteractive();
        
        imagemmemoria.on('pointerover', function () {
            this.setFrame(1);
        });

        imagemmemoria.on('pointerout', function () {
            this.setFrame(0);
        });

        imagemmemoria.once('pointerdown', function(pointer){
            this.scene.scene.stop();
            this.scene.scene.start('load',{nome: 'GameMemoria'});
        });

        imagemprocessos.on('pointerover', function () {
            this.setFrame(1);
        });

        imagemprocessos.on('pointerout', function () {
            this.setFrame(0);
        });

        imagemprocessos.once('pointerdown', function(pointer){
            this.scene.scene.stop();
            this.scene.scene.start('load',{nome: 'GameProcessos'}); 
        });

        imagemarquivos.on('pointerover', function () {
            this.setFrame(1);
        });

        imagemarquivos.on('pointerout', function () {
            this.setFrame(0);
        });

        imagemarquivos.once('pointerdown', function(pointer){
            this.scene.scene.stop();
            this.scene.scene.start('load',{nome: 'GameArquivos'}); 
        });

        imagemdispositivos.on('pointerover', function () {
            this.setFrame(1);
        });

        imagemdispositivos.on('pointerout', function () {
            this.setFrame(0);
        });

        imagemdispositivos.once('pointerdown', function(pointer){
            this.scene.scene.stop();
            this.scene.scene.start('load',{nome: 'GameDispositivos'}); 
        });
    }
    update(){
        //console.log(this.scene.isVisible('load'));
    }
};


var game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#c0c0c0',
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: [menu, load,GameMemoria,GameArquivos,GameDispositivos,Disploader,GameProcessos, jogo, sobre, instrucao, creditos]
});
