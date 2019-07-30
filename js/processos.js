
// var controleMusica = true; //Variável utilizada para não bugar a musica do menu quando pressionado o botão "voltar"
                    //das cenas "instruções", "créditos" e "sobre"

class GameProcessos extends Phaser.Scene{
    constructor(){
        super({key: 'GameProcessos'});
    }

    init(){
        //game.renderer.resize(LARGURA, ALTURA);
    }

    preload(){
        this.load.spritesheet('FIFO', 'assets/botaoFIFO.png', {frameWidth: 270, frameHeight: 40});
        this.load.spritesheet('SJF', 'assets/botaoSJF.png', {frameWidth: 270, frameHeight: 40});
        this.load.spritesheet('PRIORIDADE', 'assets/botaoPRIORIDADE.png', {frameWidth: 270, frameHeight: 40});
        this.load.spritesheet('INSTRUCOES', 'assets/botaoInstrucoes.png', {frameWidth: 277, frameHeight: 40});
        this.load.spritesheet('SOBRE', 'assets/botaoSOBRE.png', {frameWidth: 167, frameHeight: 40});
        this.load.spritesheet('CREDITOS','assets/botaoCREDITOS.png',{frameWidth:227,frameHeight:40});
        this.load.spritesheet('MUSICA', 'assets/musicicon.png', {frameWidth: 17, frameHeight: 17});
        this.load.spritesheet('SOM', 'assets/soundicon.png', {frameWidth: 17, frameHeight: 17});
        this.load.audio('musicaMenu', 'audio/musicaMenu.wav');
        this.load.audio('beepBotao', 'audio/beepBotao.wav');
        this.load.audio('botaoPressionado', 'audio/botaoPressionado.wav');
    }
    create(){
        
        const escalonamento = {
            FIFO: 1,
            SJF: 2,
            PRIORIDADE: 3
        }
        var somMenu;
        var escalonamentoTexto;
        var botaoFIFO;
        var botaoSJF;
        var botaoPRIORIDADE;
        var botaoInstrucoes;
        var botaoSobre;
        var botaoCREDITOS;
        var botaoMusica;
        var botaoSom;
        var tipoEscalonamento;
        somBotao = this.sound.add('beepBotao').setVolume(2);
        botaoPressionado = this.sound.add('botaoPressionado').setVolume(0.1);
        somMenu = this.sound.add('musicaMenu', {loop: true});
        
        escalonamentoTexto = this.add.text(LARGURA/2, ALTURA/6, 'Processos', {font:'64px font1', color:'#000000'});
        escalonamentoTexto.setOrigin(0.5);
        botaoFIFO = this.add.sprite(LARGURA/2, ALTURA/2,'FIFO').setOrigin(0.5).setInteractive();
        botaoPRIORIDADE = this.add.sprite(LARGURA/2, ALTURA/2 + ALTURA/12,'PRIORIDADE').setOrigin(0.5).setInteractive();
        botaoSJF = this.add.sprite(LARGURA/2, ALTURA/2 + ALTURA/6,'SJF').setOrigin(0.5).setInteractive();
        botaoInstrucoes = this.add.sprite(LARGURA/2, ALTURA/2-ALTURA/12,'INSTRUCOES').setOrigin(0.5).setInteractive();
        botaoSobre = this.add.sprite(LARGURA/2, ALTURA/2 + ALTURA/6 + ALTURA/12 ,'SOBRE').setOrigin(0.5).setInteractive();
        botaoCREDITOS = this.add.sprite(LARGURA/2, ALTURA-100,'CREDITOS').setOrigin(0.5).setInteractive();
        botaoMusica = this.add.sprite(LARGURA - 20, 20, 'MUSICA').setOrigin(0.5).setInteractive();
        botaoSom = this.add.sprite(LARGURA - 40, 20, 'SOM').setOrigin(0.5).setInteractive();

        if(!habilitaMusica){
            botaoMusica.setFrame(2);
            somMenu.pause();
        }else
            somMenu.play();
        if(!habilitaSom)
            botaoSom.setFrame(2);

        //BOTÕES PARA CONTROLE DO AUDIO
        botaoMusica.on('pointerover', function(){
            botaoMusica.setFrame(1);
        });
        botaoMusica.on('pointerout' , function(){
            if(habilitaMusica)
                botaoMusica.setFrame(0);
            else botaoMusica.setFrame(2);
        });
        botaoMusica.on('pointerdown' , function(){
            habilitaMusica = !habilitaMusica;
            if(habilitaSom)
                somBotao.play();
            if(habilitaMusica)
                somMenu.play();
            else{
                somMenu.pause();
                botaoMusica.setFrame(2);
            }
            // cenaJogo.setHabilitaMusica(habilitaMusica);
        });

        botaoSom.on('pointerover', function(){
            botaoSom.setFrame(1);
        });
        botaoSom.on('pointerout' , function(){
            if(habilitaSom)
                botaoSom.setFrame(0);
            else botaoSom.setFrame(2); 
        });
        botaoSom.on('pointerdown' , function(){
            if(habilitaSom)
                somBotao.play();
            else{
                botaoSom.setFrame(2);
            }
            habilitaSom = !habilitaSom;
            // cenaJogo.setHabilitaSom(habilitaSom);
        });


        //BOTÕES PARA OS MODOS DE JOGO
        botaoFIFO.on('pointerover', function(){
            botaoFIFO.setFrame(1);
            if(habilitaSom)
                somBotao.play();
        });
        botaoFIFO.on('pointerout' , function(){
            botaoFIFO.setFrame(0);
        });
        botaoFIFO.on('pointerdown' , function(){
            tipoEscalonamento = escalonamento.FIFO;
            if(habilitaSom)
                botaoPressionado.play();
            somMenu.pause();
            this.scene.scene.start('jogo', {modo: tipoEscalonamento});
        });
        

        botaoSJF.on('pointerover', function(){
            botaoSJF.setFrame(1);
            if(habilitaSom)
                somBotao.play();
        });
        botaoSJF.on('pointerout' , function(){
            botaoSJF.setFrame(0);
        });
        botaoSJF.on('pointerdown' , function(){
            tipoEscalonamento = escalonamento.SJF;
            if(habilitaSom)
                botaoPressionado.play();
            somMenu.pause();
            this.scene.scene.start('jogo', {modo: tipoEscalonamento});
        });


        botaoPRIORIDADE.on('pointerover', function(){
            botaoPRIORIDADE.setFrame(1);
            if(habilitaSom)
                somBotao.play();
        });
        botaoPRIORIDADE.on('pointerout' , function(){
            botaoPRIORIDADE.setFrame(0);
        });
        botaoPRIORIDADE.on('pointerdown' , function(){
            tipoEscalonamento = escalonamento.PRIORIDADE;
            if(habilitaSom)
                botaoPressionado.play();
            somMenu.pause();
            this.scene.scene.start('jogo', {modo: tipoEscalonamento});
        });

        botaoInstrucoes.on('pointerover', function(){
            botaoInstrucoes.setFrame(1);
            if(habilitaSom)
                somBotao.play();
        });
        botaoInstrucoes.on('pointerout' , function(){
            botaoInstrucoes.setFrame(0);
        });
        botaoInstrucoes.on('pointerdown' , function(){
            if(habilitaSom)
                botaoPressionado.play();
            somMenu.stop();
            this.scene.scene.start('instrucao');
        });

        botaoSobre.on('pointerover', function(){
            botaoSobre.setFrame(1);
            if(habilitaSom)
                somBotao.play();
        });
        botaoSobre.on('pointerout' , function(){
            botaoSobre.setFrame(0);
            
        });
        botaoSobre.on('pointerdown' , function(){
            if(habilitaSom)
                botaoPressionado.play();
                somMenu.stop();
             this.scene.scene.start('sobre');
        });


        botaoCREDITOS.on('pointerover', function(){
            botaoCREDITOS.setFrame(1);
            if(habilitaSom)
                somBotao.play();
        });
        botaoCREDITOS.on('pointerout' , function(){
            botaoCREDITOS.setFrame(0);
        });
        botaoCREDITOS.on('pointerdown' , function(){
            if(habilitaSom)
                botaoPressionado.play();
            somMenu.stop();
             this.scene.scene.start('creditos');
        });

        this.events.emit('pronto');
    }
}

class instrucao extends Phaser.Scene{
    constructor(){
        super({key: 'instrucao'});
    }
    preload(){
        this.load.spritesheet('botaoVOLTAR', 'assets/botaoVOLTAR.png', {frameWidth: 200, frameHeight: 40});
       	this.load.image('instrucao', 'assets/instrucao.png');
    }
    create(){
        var botaoVOLTAR;
        botaoVOLTAR = this.add.sprite(LARGURA/2, ALTURA-50 ,'botaoVOLTAR').setOrigin(0.5).setInteractive();
        this.physics.add.sprite(LARGURA/2, ALTURA/2, 'instrucao');
        botaoVOLTAR.setDepth(1);
        botaoVOLTAR.on('pointerover', function(){
            botaoVOLTAR.setFrame(1);
            if(habilitaSom)
                somBotao.play();
        });
        botaoVOLTAR.on('pointerout' , function(){
            botaoVOLTAR.setFrame(0);
        });
        botaoVOLTAR.on('pointerdown' , function(){
            if(habilitaSom)
                botaoPressionado.play();
            // controleMusica = false;
            this.scene.scene.start('GameProcessos');
            
        });

    }
    
}

class sobre extends Phaser.Scene{
    constructor(){
        super({key: 'sobre'});
    }
    preload(){
        this.load.spritesheet('botaoVOLTAR', 'assets/botaoVOLTAR.png', {frameWidth: 200, frameHeight: 40});
       	this.load.image('sobre', 'assets/sobre.png');
    }
    create(){
        var botaoVOLTAR;
        botaoVOLTAR = this.add.sprite(LARGURA/2, ALTURA-50 ,'botaoVOLTAR').setOrigin(0.5).setInteractive();
       	this.physics.add.sprite(LARGURA/2, ALTURA/2, 'sobre');

        botaoVOLTAR.setDepth(1);
        botaoVOLTAR.on('pointerover', function(){
            botaoVOLTAR.setFrame(1);
            if(habilitaSom)
                somBotao.play();
        });
        botaoVOLTAR.on('pointerout' , function(){
            botaoVOLTAR.setFrame(0);
        });
        botaoVOLTAR.on('pointerdown' , function(){
            if(habilitaSom)
                botaoPressionado.play();
            // controleMusica = false;
            this.scene.scene.start('GameProcessos');
        });

    }
}

class creditos extends Phaser.Scene{
    constructor(){
        super({key: 'creditos'});
    }
    preload(){
        this.load.spritesheet('botaoVOLTAR', 'assets/botaoVOLTAR.png', {frameWidth: 200, frameHeight: 40});
       	this.load.image('creditos', 'assets/creditos.png');
       }

       	create(){
        var botaoVOLTAR;
        botaoVOLTAR = this.add.sprite(LARGURA/2, ALTURA-50 ,'botaoVOLTAR').setOrigin(0.5).setInteractive();
       	this.physics.add.sprite(LARGURA/2, ALTURA/2.5, 'creditos');

        botaoVOLTAR.setDepth(1);
        botaoVOLTAR.on('pointerover', function(){
            botaoVOLTAR.setFrame(1);
            if(habilitaSom)
                somBotao.play();
        });
        botaoVOLTAR.on('pointerout' , function(){
            botaoVOLTAR.setFrame(0);
        });
        botaoVOLTAR.on('pointerdown' , function(){
            if(habilitaSom)
                botaoPressionado.play();
            // controleMusica = false;
            this.scene.scene.start('GameProcessos');
        });
    }
}