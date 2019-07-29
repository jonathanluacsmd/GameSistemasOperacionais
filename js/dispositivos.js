
var game;

// Variáveis globais
var gameOptions = {

    // Velocidade de rotação do disco.
    velicidadeRotacao: 3,

    // Velocidade do movimento do braço.
    velocidadeLancamento: 150,

    // Angulo mínimo entre os braços.
    anguloMin: 15,

    // Variação máxima da velocidade de rotação.
    variacaoRotacao: 2,

    // Intervalo antes da próxima variação de velocidade de rotação.
    variacaoTempo: 2000,

    // Velocidade máxima de rotação.
    maxVelicidadeRotacao: 6
}

var score = 0;
var scoreText;
var maxScore = 0;
var maxScoreText;
var rpmText;
var rpm = 0;
var roda = true;

class GameDispositivos extends Phaser.Scene{

    constructor(){
        super("GameDispositivos");
    }


    preload(){
        this.load.image('t','./img/loading.gif');

        this.load.image("disco", "img/dispositivos/disco.png");
        this.load.image("braco", "img/dispositivos/braco.png");
        this.load.image("sairV2", "img/dispositivos/sairV2.png");
        this.load.image("fundo", "img/dispositivos/fundo.png");
        this.load.image("arquivo", "img/dispositivos/arquivo.png");
        this.load.image("painel", "img/dispositivos/painel.png");
        //this.load.audio('musica', ['audio/CncMachine.mp3']);

    }

    create(){

        this.add.image(400,300,'t');
        setTimeout(
            () => {
                this.events.emit('pronto');
            },
            5000
        );   

        /* Play musica.
        var musica = this.sound.add('musica');
        musica.loop = true;
        musica.play();
        */

        // Posicionando imagem sair.
        var sairV2 = this.add.image(600,500, 'sairV2').setInteractive();

        // Posicionando imagem fundo.
        this.fundo = this.add.tileSprite(game.config.width/4,  game.config.height/2, 400,600, 'fundo');

        // Posicionando imagem painel.
        var painel = this.add.image(600,200, 'painel');

        // Adicionando textos de score e RPM.
        scoreText = this.add.text(435, 50, 'Score atual: ' + String(score), { fontSize: '30px', fill: '#000' });
        maxScoreText = this.add.text(435, 120, 'Score máximo: ' + String(maxScore), { fontSize: '30px', fill: '#000' });
        rpmText = this.add.text(435, 270, 'RPM: ' + String(rpm), { fontSize: '40px', fill: '#000' });

        // No início do jogo, tanto a velocidade de rotação atual como a nova velocidade de rotação estão configuradas para a velocidade de rotação padrão.
        this.atualVelocidadeRotacao = gameOptions.velicidadeRotacao;
        this.newVelocidadeRotacao = gameOptions.velicidadeRotacao;

        this.lancar = true;

        // Grupo para armazenar todos os braços.
        this.bracoGroup = this.add.group();

        // Adicionando o braço.
        this.braco = this.add.sprite(game.config.width / 4, game.config.height / 5 * 4, "braco");

        // Adicionando o disco.
        this.disco = this.add.sprite(game.config.width / 4, 175, "disco");

        // Movendo o disco para frente.
        this.disco.depth = 1;

        // Iniciando o ângulo do arquivo.
        var anguloArquivo = Phaser.Math.Between(0, 360);

        // Determinando o ângulo do arquivo.
        var radians = Phaser.Math.DegToRad(anguloArquivo - 90);

        // Adicionando o arquivo
        this.arquivo = this.add.sprite(this.disco.x + (this.disco.width / 2) * Math.cos(radians), this.disco.y + (this.disco.width / 2) * Math.sin(radians), "arquivo");

        // Definindo o espaçamento entre o arquivo e o disco.
        this.arquivo.setOrigin(0.5, 1);

        // Definindo o ângulo do sprite do arquivo.
        this.arquivo.angle = anguloArquivo;

        // Salvando o ângulo inicial do arquivo
        this.arquivo.startAngulo = anguloArquivo;

        // Profundidade do arquivo é igual à profundidade do disco
        this.arquivo.depth = 1;

        // O arquivo foi atingido?
        this.arquivo.hit = false;

        // Esperando a entrada do jogador para lançar o braço.
        this.input.on("pointerdown", this.ativaBraco, this);

        // Evento de temporizador em loop antes da variacaoTempo.
        if(roda==true){
            roda = false;
            var timedEvent = this.time.addEvent({
                delay: 0,
                callback: this.mudaVelocidade,
                callbackScope: this,
            });
        }

        // Evento de temporizador em loop depois da variacaoTempo;
        if(roda==false){
            var timedEvent = this.time.addEvent({
                delay: gameOptions.variacaoTempo,
                callback: this.mudaVelocidade,
                callbackScope: this,
                loop: true
            });
        }
        sairV2.on('pointerover', function () {
            this.setTint(0xBF6060);
        });

        sairV2.on('pointerout', function () {
            this.clearTint();
        });

        sairV2.on('pointerdown', function(pointer){
            score = 0;
            scoreText.setText('Score atual: ' + score);
            //musica.stop();
            this.scene.scene.start('menu');
        });
        this.events.emit('pronto');
    }

    // Método para mudar a velocidade de rotação do alvo
    mudaVelocidade(){

        // Operador ternário para escolher entre +1 e -1
        var operador = Phaser.Math.Between(0, 1) == 0 ? -1 : 1;

        // número aleatório entre -gameOptions.variacaoRotacao e gameOptions.variacaoRotacao.
        var variation = Phaser.Math.FloatBetween(-gameOptions.variacaoRotacao, gameOptions.variacaoRotacao);

        // nova velocidade de rotação
        this.newVelocidadeRotacao = (this.atualVelocidadeRotacao + variation) * operador;

        // definindo novos limites de velocidade de rotação
        this.newVelocidadeRotacao = Phaser.Math.Clamp(this.newVelocidadeRotacao, -gameOptions.maxVelicidadeRotacao, gameOptions.maxVelicidadeRotacao);
    }

    // Método para ativar um braco
    ativaBraco(){

        // O jogador pode jogar?
        if(this.lancar){

            // O jogador não pode mais jogar
            this.lancar = false;

            // Interpolação entre o braço e o disco.
            this.tweens.add({

                // Adicionando o braco ao disco.
                targets: [this.braco],

                // Destino y.
                y: this.disco.y + this.disco.width / 2,

                // Duração da interpolação.
                duration: gameOptions.velocidadeLancamento,

                // Escopo de retorno de chamada.
                callbackScope: this,

                /// Função a ser executada quando a interpolação for concluída.
                onComplete: function(tween){

                    // Houve colisão.
                    var colisao = true;

                    // Obtendo uma matriz com todos os braços em rotação.
                    var children = this.bracoGroup.getChildren();

                    // Looping através dos braços em rotação.
                    for (var i = 0; i < children.length; i++){

                        // Se os braços estiverem proximos?
                        if(Math.abs(Phaser.Math.Angle.ShortestBetween(this.disco.angle, children[i].anguloImpacto)) < gameOptions.anguloMin){

                            // Não houve uma colisão.
                            colisao = false;
                            break;
                        }
                    }

                    // Se houver uma colisão.
                    if(colisao){

                        // Se o braço estiver perco do arquivo e o arquivo for atingido.
                        if(Math.abs(Phaser.Math.Angle.ShortestBetween(this.disco.angle, 180 - this.arquivo.startAngulo)) < gameOptions.anguloMin && !this.arquivo.hit){

                            // Arquivo foi atingido.
                            this.arquivo.hit = true;
                            score++;
                            if(score>=maxScore){
                                maxScore++;
                            }
                            scoreText.setText('Score atual: ' + score);

                            // Adiciona outro arquivo na mesma posição do anterior.
                            var slice = this.add.sprite(this.arquivo.x, this.arquivo.y, "arquivo", 2);

                            // Mesmo ângulo.
                            slice.angle = this.arquivo.angle;

                            // Mesmo espaçamento.
                            slice.setOrigin(0.5, 1);

                            // Desaparecer com o arquivo quando for atingido.
                            this.tweens.add({

                                // Adicionando o braço no disco.
                                targets: [this.arquivo, slice],

                                // Destino y.
                                y: game.config.height + this.arquivo.height,

                                // Destino x.
                                x: {

                                    // Executando uma função para obter os diferentes extremos de x para cada arquivo de acordo com o número do quadro.
                                    /*getEnd: function(target, key, value){
                                        return Phaser.Math.Between(0, game.config.width / 2) + (game.config.width / 2 * (target.frame.name - 1));
                                    }*/
                                },

                                // Destino de rotação.
                                angle: 45,

                                // Duração da interpolação.
                                duration: gameOptions.velocidadeLancamento * 6,

                                // Escopo de retorno de chamada.
                                callbackScope: this,

                                // Função a ser executada quando a interpolação for concluída
                                onComplete: function(tween){

                                    // Reinicia o jogo.
                                    this.scene.start("GameDispositivos")
                                }
                            });
                        }

                        // O jogador pode agora jogar de novo
                        this.lancar = true;

                        // Adicionando um novo braco no mesmo lugar do braco acabou de colidir com odisco.
                        var braco = this.add.sprite(this.braco.x, this.braco.y, "braco");

                        // anguloImpacto salva o ângulo de destino quando o braco atinge o disco.
                        braco.anguloImpacto = this.disco.angle;

                        // Adicionando o braco ao grupo bracoGroup.
                        this.bracoGroup.add(braco);

                        // Trazendo de volta o braco para sua posição inicial.
                        this.braco.y = game.config.height / 5 * 4;
                    }

                    // Se não houver uma colisão.
                    else{

                        // Função para fazer o braco cair.
                        this.tweens.add({

                            // Adicionando o braco ao disco.
                            targets: [this.braco],

                            // Destino y.
                            y: game.config.height + this.braco.height,

                            // Destino de rotação.
                            rotation: 5,

                            // Duração da colisão.
                            duration: gameOptions.velocidadeLancamento * 4,

                            // Escopo de retorno de chamada
                            callbackScope: this,

                            // Função a ser executada quando a interpolação for concluída.
                            onComplete: function(tween){

                                // Reinicia o score.
                                score = 0;
                                scoreText.setText('Score atual: ' + score);
                                maxScoreText.setText('Score máximo: ' + maxScore);

                                // Reinicie o jogo.
                                this.scene.start("GameDispositivos")
                            }
                        });
                    }
                }
            });
        }
    }

    // método a ser executado em cada quadro.
    update(time, delta){

        //console.log("GameDispositivos");

        // Rodando o disco.
        this.disco.angle += this.atualVelocidadeRotacao;

        // Obtendo uma matriz com todos os braços.
        var children = this.bracoGroup.getChildren();

        // Looping através dos braços.
        for (var i = 0; i < children.length; i++){

            // Rodando o braco.
            children[i].angle += this.atualVelocidadeRotacao;

            // Transformando o ângulo do braco em radianos.
            var radians = Phaser.Math.DegToRad(children[i].angle + 90);

            // Trigonometria para fazer o braco girar em torno do centro alvo.
            children[i].x = this.disco.x + (this.disco.width / 2) * Math.cos(radians);
            children[i].y = this.disco.y + (this.disco.width / 2) * Math.sin(radians);
        }

        // Se o arquivo não foi atingido ...
        if(!this.arquivo.hit){

            // Adjusting arquivo rotation.
            this.arquivo.angle += this.atualVelocidadeRotacao;

            // Ajustando a rotação do arquivo.
            var radians = Phaser.Math.DegToRad(this.arquivo.angle - 90);

            // Ajustando posição do arquivo.
            this.arquivo.x = this.disco.x + (this.disco.width / 2) * Math.cos(radians);
            this.arquivo.y = this.disco.y + (this.disco.width / 2) * Math.sin(radians);
        }

        // Adjusting atual rotation speed using linear interpolation
        this.atualVelocidadeRotacao = Phaser.Math.Linear(this.atualVelocidadeRotacao, this.newVelocidadeRotacao, delta / 1000);
        rpmText.setText('RPM: ' + parseInt((this.atualVelocidadeRotacao*1000)/2));
    }


}

