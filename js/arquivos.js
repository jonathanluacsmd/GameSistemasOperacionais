
var player;
var platforms; //paredes
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var infoText; //blocos restantes
var keyM;
var keySpace;
var texto; //texto = infoText
var baus;
var i; //usados nos "for"
var j; //guarda o número gerado aleatoriamente do próximo baú
var bases; //bases dos baús para interação do jogador
var baseInicial; //onde o jogador começa
// informações das localizações dos baús:
var infos=['setor 1 - esquerda baixo', 'setor 1 - direita cima', 'setor 1 - direita baixo'];
var infoAjuda; // informações do proximo bloco na tecla M
var infoAux; // Para escrever 'proximo bau'
var tutorial1; // informações básicas no início
var tutorial2;
var tutorial3;
var contBlocos = 1; // número de blocos restantes
var level = 1; // número de blocos que o jogador precisará coletar
var tempo = 100; // tempo inicial
var tempoRest; //para mostrar o tempo restante
var timedEvent; //para decrementar o tempo restante
var auxX = 0; //para reproduzir a animação do jogador parado
var auxY = 0;
var bauAberto;
var bauBloco;

class GameArquivos extends Phaser.Scene {
    constructor (){
        super('GameArquivos');
    }

    preload()
    {
        this.load.image('t','./img/loading.gif');

        this.load.image('background', './img/arquivos/Background.jpg');
        this.load.image('wallH', './img/arquivos/wallH.png');
        this.load.image('wallV', './img/arquivos/wallV.png');
        this.load.image('wallHm', './img/arquivos/wallHmenor.png');
        this.load.image('wallVm', './img/arquivos/wallVmenor.png');
        this.load.spritesheet('characterBack', './img/arquivos/SOCharacterBack.png', {frameWidth: 17, frameHeight: 23});
        this.load.spritesheet('characterFront', './img/arquivos/SOCharacterFront.png', {frameWidth: 17, frameHeight: 24});
        this.load.spritesheet('characterSideRight', './img/arquivos/SOCharacterSideRight.png', {frameWidth: 16, frameHeight: 22});
        this.load.spritesheet('characterSideLeft', './img/arquivos/SOCharacterSideLeft.png', {frameWidth: 16, frameHeight: 22});
        this.load.image('bau', './img/arquivos/bau.png');
        this.load.image('base', './img/arquivos/circuito.png');
        this.load.image('base-bau', './img/arquivos/base-bau.png');
        this.load.image('trans-h', './img/arquivos/transicao-h.jpg');
        this.load.image('trans-v', './img/arquivos/transicao-v.jpg');
		this.load.image('bau-aberto', './img/arquivos/bau-aberto.png');
        this.load.image('bau-bloco', './img/arquivos/bau-bloco.png');
        
        this.events.emit('pronto');
    }

    create() 
    {
            //  O plano de fundo e a base inicial do jogador
        this.add.image(0, 0, 'background').setOrigin(0).setScrollFactor(1);
        this.add.image(0, 600, 'background').setOrigin(0).setScrollFactor(1);
        this.add.image(800, 0, 'background').setOrigin(0).setScrollFactor(1);
        this.add.image(800, 600, 'background').setOrigin(0).setScrollFactor(1);
        baseInicial = this.physics.add.image(190, 150, 'base');
        this.add.image(801, 305, 'trans-h');
        this.add.image(801, 905, 'trans-h');
        this.add.image(401, 645, 'trans-v');
        this.add.image(1201, 645, 'trans-v');
    
        // O grupo que contém as paredes
        platforms = this.physics.add.staticGroup();
        //exemplo de como mudar a escala de uma imagem
        //platforms.create(400, 568, 'wallH').setScale(2).refreshBody();
        // Criando algumas "bordas" ou paredes 
        platforms.create(600, 400, 'wallH');
        platforms.create(50, 300, 'wallH');
        platforms.create(800, 150, 'wallH');
        platforms.create(1400, 220, 'wallH');
        platforms.create(990, 750, 'wallH');
        platforms.create(1250, 900, 'wallH');
        platforms.create(200, 1050, 'wallH');
        platforms.create(400, 800, 'wallHm');
        platforms.create(1284, 484, 'wallHm');

        platforms.create(400, 0, 'wallV');
    	platforms.create(200, 700, 'wallV');
    	platforms.create(600, 800, 'wallV');
    	platforms.create(1150, 1100, 'wallV');
        platforms.create(1200, 240, 'wallVm');
        platforms.create(1200, 380, 'wallVm');
        platforms.create(1450, 984, 'wallVm');
    
        // divisória horizontal dos setores
        platforms.create(159, 600, 'wallH');
        platforms.create(642, 600, 'wallH');
        platforms.create(959, 600, 'wallH');
        platforms.create(1442, 600, 'wallH');
        // divisória vertical dos setores
        platforms.create(800, 63, 'wallV');
        platforms.create(800, 546, 'wallV');
        platforms.create(800, 663, 'wallV');
        platforms.create(800, 1146, 'wallV');

        // baús em cada setor
        baus = this.physics.add.staticGroup();
        // setor 1
        baus.create(80, 500, 'bau').setScale(0.5).refreshBody();
        baus.create(720, 110, 'bau').setScale(0.5).refreshBody();
        baus.create(720, 500, 'bau').setScale(0.5).refreshBody();
        //setor 2
        baus.create(900, 110, 'bau').setScale(0.5).refreshBody();
        baus.create(1500, 150, 'bau').setScale(0.5).refreshBody();
        baus.create(900, 510, 'bau').setScale(0.5).refreshBody();
        baus.create(1300, 300, 'bau').setScale(0.5).refreshBody();
        baus.create(1520, 440, 'bau').setScale(0.5).refreshBody();
        //setor 3
        baus.create(100, 710, 'bau').setScale(0.5).refreshBody();
        baus.create(720, 710, 'bau').setScale(0.5).refreshBody();
        baus.create(400, 850, 'bau').setScale(0.5).refreshBody();
        baus.create(100, 1110, 'bau').setScale(0.5).refreshBody();
        baus.create(700, 1140, 'bau').setScale(0.5).refreshBody();
        //setor 4
        baus.create(900, 710, 'bau').setScale(0.5).refreshBody();
        baus.create(1500, 710, 'bau').setScale(0.5).refreshBody();
        baus.create(950, 1140, 'bau').setScale(0.5).refreshBody();
        baus.create(1250, 1140, 'bau').setScale(0.5).refreshBody();
        baus.create(1300, 970, 'bau').setScale(0.5).refreshBody();

		// colocando os baús abertos, com e sem bloco dentro
		bauAberto = this.add.image(500, 500, 'bau-aberto').setScale(0.5);
		bauBloco = this.add.image(500, 500, 'bau-bloco').setScale(0.5);
		bauAberto.setVisible(false);
		bauBloco.setVisible(false);

        //criando "bases" dos baús(com +30px em cada direção), que serão usadas para interação com player
        bases = this.physics.add.staticGroup();
        for (i=0; i < baus.countActive(true); i++) //baus.countActive(true) retorna o número de baús "ativos"
        {
            bases.create(baus.getChildren()[i].x, baus.getChildren()[i].y, 'base-bau');
        } // getChildren acessa um baú que pertence ao grupo "baus"
        for (i=0; i < baus.countActive(true); i++)
        {
            bases.getChildren()[i].setVisible(false); 
        }// deixa as bases invisíveis, pq servem apenas como área de interação com player

        // colocando o resto das informações dos baús que aparecem na tecla M
        infos.push('setor 2 - esquerda cima');
        infos.push('setor 2 - direita cima');
        infos.push('setor 2 - esquerda baixo');
        infos.push('setor 2 - baús juntos->esquerda');
        infos.push('setor 2 - baús juntos->direita');
        infos.push('setor 3 - esquerda cima');
        infos.push('setor 3 - direita cima');
        infos.push('setor 3 - meio');
        infos.push('setor 3 - esquerda baixo');
        infos.push('setor 3 - direita baixo');
        infos.push('setor 4 - esquerda cima');
        infos.push('setor 4 - direita cima');
        infos.push('setor 4 - esquerda baixo');
        infos.push('setor 4 - baús juntos->de baixo');
        infos.push('setor 4 - baús juntos->de cima');
        /*for (i=4; i <= baus.countActive(true); i++)
        {
            infos.push('bau ' + i );
        }*/

        // O jogador e suas configurações 
        //player = this.physics.add.sprite(200, 150, 'dude');
        player = this.physics.add.sprite(200, 150, 'characterFront');

        // Propriedades físicas do jogador 
        player.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, 800 * 2, 600 * 2); //bordas do mundo conforme seu tamanho

        // Animações do jogador (andar para a direita, esquerda, cima, baixo e virar para frente)
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('characterSideLeft', { start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('characterSideRight', { start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('characterBack', { start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('characterFront', { start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'standing',
            frames: [ { key: 'characterFront', frame: 0 } ],
            frameRate: 20
        });

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();

        // Colisão do jogador com as paredes e os baús
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(player, baus);

        // Checa para ver se jogador sobrepôs com alguma base de baú ou base inicial, 
        // se sim, chama as funções collectBlock e finishFile, respectivamente
        this.physics.add.overlap(player, bases, this.collectBlock, null, this);
        this.physics.add.overlap(player, baseInicial, this.finishFile, null, null);

        // Faz a câmera não passar das bordas do "mundo" e seguir o jogador
        this.cameras.main.setBounds(0, 0, 800 * 2, 600 * 2);
        this.cameras.main.startFollow(player, true, 0.09, 0.09);
        // this.cameras.main.roundPixels = true;
        // Zoom da câmera, que pode ser alterado para testes 
        // valor padrão para o jogo é 1 ; 0.5 mostra o mapa inteiro
        this.cameras.main.setZoom(1);

        // Adiciona as teclas M e Space
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Informação dos blocos restantes
        infoText = this.add.text(16, 16, 'Blocos Restantes: '+contBlocos, { fontFamily: 'Verdana', fontSize: '32px', fill: '#000' });
        texto = infoText;
        texto.setVisible(true);
        // Informações sobre onde está o próximo baú (na tecla M)
        infoAux = this.add.text(player.x, player.y, 'Próximo baú:', { fontFamily: 'Arial', fontSize: '32px', fill: '#000' } );
        infoAux.setVisible(true);
        // Escolhe o próximo baú aleatoriamente
        j = Phaser.Math.Between(0, 17); 
        // Informações sobre onde está o próximo baú (na tecla M)
        infoAjuda = this.add.text(player.x, player.y, infos[j], { fontFamily: 'Arial', fontSize: '32px', fill: '#000' } );
        infoAjuda.setVisible(true);
        // Informações na base inicial (sobre as teclas M e Space)
        tutorial1 = this.add.text(20, 220, 'M - informações', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' } );
        tutorial2 = this.add.text(20, 250, 'Space - interagir', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' } );
        tutorial3 = this.add.text(60, 50, 'Base Inicial', { fontFamily: 'Arial', fontSize: '36px', fill: '#ffffff' } );
        // Tempo restante
        tempoRest = this.add.text(16, 56, 'Tempo: ' + tempo, { fontFamily: 'Verdana', fontSize: '32px', fill: '#000' } );
        // Pontuação
        scoreText = this.add.text(16, 96, 'Score: ' + score, { fontFamily: 'Verdana', fontSize: '32px', fill: '#000' } );
        // Decrementa o tempo restante, conforme passa o tempo
        timedEvent = this.time.addEvent({delay: 1000, callback: function () {tempo--;}, timeScale: 1, loop: true});

    }

    update()
    {
        /*if (gameOver)
        {
            return;
        }*/
        // Define a velocidade e a animação, conforme a tecla pressionada
        if (cursors.left.isDown)
        {
            player.setVelocityX(-200);
            player.anims.play('left', true);
            auxX = 1;
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(200);
            player.anims.play('right', true);
            auxX = 1;
        }
        else
        {
            player.setVelocityX(0);
            auxX = 0;
        }
        
        if (cursors.up.isDown)
        {
            player.setVelocityY(-200);
            player.anims.play('up', true);
            auxY = 1;
        }
        else if (cursors.down.isDown)
        {
            player.setVelocityY(200);
            player.anims.play('down', true);
            auxY = 1;
        }
        else
        {
            player.setVelocityY(0);
            auxY = 0;
        }
    
        if (auxX == 0 && auxY == 0)
        {
            player.anims.play('standing');
        }
    
        // Mostra as informações sobre o próximo baú na tecla M
        if (keyM.isDown)
        {
            infoAux.setPosition(player.x - 100, player.y - 150);
            infoAux.setVisible(true);
            infoAjuda.setPosition(player.x - 250, player.y - 100);
            infoAjuda.setVisible(true);
        }
        else
        {
            infoAux.setVisible(false);
            infoAjuda.setVisible(false);
        }
    
        // Faz a pontuação e o tempo restante seguirem player
        texto = infoText;
        scoreText.setText('Score: ' + score);
        if (player.x - 320 < 0 && player.y - 250 < 0)
        {
            texto.setPosition(texto.x, texto.y);
            tempoRest.setPosition(tempoRest.x, tempoRest.y);
            scoreText.setPosition(scoreText.x, scoreText.y);
        }
        else if (player.x - 320 < 0)
        {
            texto.setPosition(texto.x, player.y - 250);
            tempoRest.setPosition(tempoRest.x, player.y - 210);
            scoreText.setPosition(scoreText.x, player.y - 170);
        }
        else if (player.y - 250 < 0)
        {
            texto.setPosition(player.x - 320, texto.y);
            tempoRest.setPosition(player.x - 320, tempoRest.y);
            scoreText.setPosition(player.x - 320, scoreText.y);
        }
        else
        {
            texto.setPosition(player.x - 320, player.y - 250);
            tempoRest.setPosition(player.x - 320, player.y - 210);
            scoreText.setPosition(player.x - 320, player.y - 170);
        }
    
        // Atualiza o tempo restante. Caso seja <0, termina o jogo
        if (tempo >= 0)
        {
            tempoRest.setText('Tempo: ' + tempo);
            gameOver = false;
        }
        else 
        {
            //this.physics.pause();
            //player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
			tempoRest.setText('Tempo: 0 -> Space + M -> Menu');
			if (keySpace.isDown && keyM.isDown)
			{
				tempo = 100;
				level = 1;
				contBlocos = 1;
				score = 0;
				player.setPosition(200, 150);
				gameOver = false;
				infoText.setText('Blocos Restantes: ' + contBlocos);
				texto = infoText;
				scoreText.setText('Score: ' + score);
				tempoRest.setText('Tempo: ' + tempo);
				this.scene.start('menu');
			}
        }
    
    }

    // Função para coletar o bloco, se player estiver no baú correto
    collectBlock (player, base)
    {
        if (keySpace.isDown && !gameOver)
        {
            if (base == bases.getChildren()[j] && contBlocos > 0)
            {
				bauBloco.setPosition(base.x, base.y);
				bauBloco.setVisible(true);
				
                j = Phaser.Math.Between(0, 17);
                infoAjuda.setText( infos[j] );
                contBlocos = contBlocos - 1;
                infoText.setText('Blocos Restantes: ' + contBlocos);
            }
            else if (contBlocos == 0)
            {
				bauAberto.setPosition(base.x, base.y);
				bauAberto.setVisible(true);
			
                infoText.setText('Blocos Restantes: ' + contBlocos + ' volte à base');
            }
			else
			{
				bauAberto.setPosition(base.x, base.y);
				bauAberto.setVisible(true);
			}
        }
		else
		{
			bauBloco.setVisible(false);
			bauAberto.setVisible(false);
		}
    
    }

    // Função que completa o "arquivo", se foram coletados todos os blocos (blocos restantes = 0)
    // e player está interagindo com a base inicial
    finishFile (player, baseInicial)
    {
        if (keySpace.isDown && contBlocos == 0 && !gameOver)
        {
            score += (level * 10);
            tempo += (level * 5);
            level++;
            contBlocos = level;
            infoText.setText('Blocos Restantes: ' + contBlocos);
        }
    }

};