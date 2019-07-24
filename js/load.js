class load extends Phaser.Scene {
    constructor (){
        super('load');
    }

    init() {
        this.scene.get('memoria').events.on('pronto',function(){            
            this.scene.stop();
        },this);
    }

    preload(){
        this.load.image('loading','./img/loading.jpg');
        this.scene.launch('memoria');
        this.scene.bringToTop();
    }

    create() {
        this.add.image(400,300,'loading');
    }

    update(){
        console.log('ok');
        
    }
};