var Disploader = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

	function Disploader ()
	{
		Phaser.Scene.call(this, {
			key: 'Disploader',
			pack: {
				files: [
					{ type: 'image', key: 'loadingbar_bg', url: 'img/dispositivos/loadingbar_bg.png'},
					{ type: 'image', key: 'loadingbar_fill', url: 'img/dispositivos/loadingbar_fill.png' }
				]
			}
		});
	},
	
	setPreloadSprite: function (sprite)
	{
		this.preloadSprite = { sprite: sprite, width: sprite.width, height: sprite.height };

		sprite.visible = true;

		// set callback for loading progress updates
		this.load.on('progress', this.onProgress, this );
		this.load.on('fileprogress', this.onFileProgress, this );
	},
	
	onProgress: function (value) {

		if (this.preloadSprite)
		{
			var w = Math.floor(this.preloadSprite.width * value);

			this.preloadSprite.sprite.frame.width    = w;
			this.preloadSprite.sprite.frame.cutWidth = w;

			this.preloadSprite.sprite.frame.updateUVs();
		}
	},

	onFileProgress: function (file) {
		debugger;
		assetText.setText('onFileProgress: file.key=' + file.key);
	},

	preload: function ()
	{
		this.loadingbar_bg   = this.add.sprite(400, 300, "loadingbar_bg");
		this.loadingbar_fill = this.add.sprite(400, 300, "loadingbar_fill");
		this.setPreloadSprite(this.loadingbar_fill);
		for (var i = 0; i < 500; i++) {
			this.load.image('testloading'+i, 'img/spritearray.png');
		};
	},

	create: function ()
	{
		// dispose loader bar images
		this.loadingbar_bg.destroy();
		this.loadingbar_fill.destroy();
		this.preloadSprite = null;

		// start actual game
		this.scene.start('GameDispositivos');

	}
});
