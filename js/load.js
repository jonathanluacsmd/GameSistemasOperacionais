class load extends Phaser.Scene {
    constructor (){
        super('load');
    }

    init(dadosGame) {
        this.scene.get(dadosGame.nome).events.on('pronto',function(){            
            this.scene.stop();
        },this);
    }

    preload(){
        this.load.image('loading','./img/loading.jpg');
    }

    create(dadosGame) {
        this.scene.bringToTop();
        this.scene.launch(dadosGame.nome);
        this.scene.bringToTop();
        this.add.image(400,300,'loading');
    }
};