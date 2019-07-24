class menu extends Phaser.Scene {
    constructor (){
        super({key: 'menu'});
    }

    init(){
        console.log(this.scene.key);
        //console.log(this.scene.get('menu'));
    }
    preload() {
        this.load.image('menumemoria','img/menumemoria.png');
        this.load.image('menuprocessos','img/menuprocessos.png');
        this.load.image('menudispositivos','img/menudispositivos.png');
        this.load.image('menuarquivos','img/menuarquivos.png');
    }
    create() {
        var imagemmemoria = this.add.image(290,240, 'menumemoria').setInteractive();
        var imagemprocessos = this.add.image(510,240, 'menuprocessos').setInteractive();
        var imagemarquivos = this.add.image(290,360, 'menuarquivos').setInteractive();
        var imagemdispositivos = this.add.image(510,360, 'menudispositivos').setInteractive();

        imagemmemoria.on('pointerover', function () {
            this.setTint(0x00ff00);
        });

        imagemmemoria.on('pointerout', function () {
            this.clearTint();
        });

        imagemmemoria.on('pointerdown', function(pointer){
            this.scene.scene.start('load'); 
        });

        imagemprocessos.on('pointerover', function () {
            this.setTint(0x00ff00);
        });

        imagemprocessos.on('pointerout', function () {
            this.clearTint();
        });

        imagemprocessos.on('pointerdown', function(pointer){
            this.scene.scene.start('load'); 
        });

        imagemarquivos.on('pointerover', function () {
            this.setTint(0x00ff00);
        });

        imagemarquivos.on('pointerout', function () {
            this.clearTint();
        });

        imagemarquivos.on('pointerdown', function(pointer){
            this.scene.scene.start('load'); 
        });

        imagemdispositivos.on('pointerover', function () {
            this.setTint(0x00ff00);
        });

        imagemdispositivos.on('pointerout', function () {
            this.clearTint();
        });

        imagemdispositivos.on('pointerdown', function(pointer){
            this.scene.scene.start('load'); 
        });
    }
};

var game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#c0c0c0',
    scene: [menu, load, teste]
});
