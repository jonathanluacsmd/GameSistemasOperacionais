class load extends Phaser.Scene {
    constructor (){
        super({key: 'load', pack: {
            files: [
                { type: 'image', key: 'loadingbar_bg', url: 'img/dispositivos/loadingbar_bg.png'},
                { type: 'image', key: 'loadingbar_fill', url: 'img/dispositivos/loadingbar_fill.png' }
            ]
        }});
        this.flagcarregado = [false,false];
    }

    init(dadosGame) {
        this.scene.get(dadosGame.nome).events.on('pronto',function(){
            this.flagcarregado[0] = true;
        },this);
    }

    setPreloadSprite(sprite)
	{
		this.preloadSprite = { sprite: sprite, width: sprite.width, height: sprite.height };

		sprite.visible = true;

		// set callback for loading progress updates
		this.load.on('progress', this.onProgress, this );
		this.load.on('fileprogress', this.onFileProgress, this );
	}
	
	onProgress(value) {

		if (this.preloadSprite)
		{
			var w = Math.floor(this.preloadSprite.width * value);

			this.preloadSprite.sprite.frame.width    = w;
			this.preloadSprite.sprite.frame.cutWidth = w;

			this.preloadSprite.sprite.frame.updateUVs();
		}
	}

	onFileProgress(file) {
		debugger;
		assetText.setText('onFileProgress: file.key=' + file.key);
	}

    preload(){
        this.loadingbar_bg   = this.add.sprite(400, 300, "loadingbar_bg");
        this.loadingbar_fill = this.add.sprite(400, 300, "loadingbar_fill");
        this.setPreloadSprite(this.loadingbar_fill);
		for (let i = 0; i < 500; i++) {
            this.load.image('testloading'+i, 'img/spritearray.png');
        };
        this.load.on('complete', ()=>{
            this.flagcarregado[1] = true;
        });
    }

    create(dadosGame) {
        this.scene.launch(dadosGame.nome);
        //this.scene.launch(dadosGame.nome);
        /*setTimeout(
            () => {
                //this.scene.launch(dadosGame.nome);        
            },
            1500
        );*/
        this.scene.bringToTop();
    }

    update(){
        if(this.flagcarregado[0] && this.flagcarregado[1]){
            this.loadingbar_bg.destroy();
		    this.loadingbar_fill.destroy();
            this.preloadSprite = null;     
            this.scene.stop();
        };
    }
};