class creditosprincipais extends Phaser.Scene {
    constructor (){
        super({key: 'creditosprincipais'});
    }
    preload(){
        this.load.text('creditosprincipal', 'assets/creditos.txt');
        this.load.spritesheet('botaoVoltar', 'assets/botaoVOLTAR.png', {frameWidth: 200, frameHeight: 40});
    }
    create(){
        let a = this.cache.text.get('creditosprincipal');
        let textoCreditos = this.add.text(50, 10, '', { fill: '#000000', fontFamily: 'font1', align:'left',lineSpacing: 0  ,fontSize: 10});
        botaoVoltar = this.add.sprite(700, 50, 'botaoVoltar').setOrigin(0.5).setInteractive();
        textoCreditos.setText(a);
        botaoVoltar.on('pointerover', function(){
            this.setFrame(1);
        });
        botaoVoltar.on('pointerout', function(){
            this.setFrame(0);
        });
        botaoVoltar.on('pointerdown', function(){
            this.scene.scene.stop(this.scene.key);
            this.scene.scene.start('menu');
        });
    }
    update(){

    }
}