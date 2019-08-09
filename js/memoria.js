//Classe peça

class Peca{
    constructor(tamanho, cor){
        this.tamanho = tamanho;
        this.cor = cor;
        this.imagem = null;
        this.origem = {x: 560,y: 100};
        switch (cor) {
            case 0xff0000:
                this.tempoemswap = 5;
                break;
            case 0x00ff00:
                this.tempoemswap = 8;
                break;
            case 0x0000ff:
                this.tempoemswap = 11;
                break;
            case 0xe2f61a:
                this.tempoemswap = 14;
                break;
            case 0x5a005a:
                this.tempoemswap = 16;
                break;
            default:
                break;
        }
        this.tempodevida = 10 + Math.floor(Math.random() * 20);
        this.temporizadorswap = this.tempoemswap;
        this.flagtempodevida = false;
        this.flagtempoemswap = false;
        this.flagalinhamento = false;
        this.alocada = null;
    }
}

//Classe memória
class Memoria{
	constructor(nome,numerodelinhas,tamanhodaslinhas){
        this.nome = nome;
        this.numerodelinhas = numerodelinhas;
        this.tamanhodaslinhas = tamanhodaslinhas;
        this.memoria = [];
        for(var a = 0;a<numerodelinhas; a++){
            this.memoria.push([]);
            for(var b = 0; b<tamanhodaslinhas;b++){
                this.memoria[a].push(null);
            }
        }
        this.flagalocacao = true;
    }
    /**
     * Remove a peça especificada
     * @param {Peca} p - objeto peça a ser removida
     */
    clear(){
        for (let i = 0; i < this.numerodelinhas; i++) {
            for (let j = 0; j < this.tamanhodaslinhas; j++) {
                if(this.memoria[i][j] != null){
                    this.memoria[i][j].imagem.destroy();
                }
                this.memoria[i][j]=null;
            }
        }
        this.flagalocacao = true;
    }
    removePeca(p){
        if (p!=null) {
            for (let i = 0; i < this.numerodelinhas; i++) {
                for (let f = 0; f < this.tamanhodaslinhas; f++) {
                    if (this.memoria[i][f] === p) {
                        this.memoria[i][f] = null;
                    }
                }
            }
            return true;
        }
        return false;
    }
    /**
     * Função adicional que remove uma peça com base na posição indicada e
     * retorna a peça que foi removida
     *
     * @param {number} linha -linha em que a peça a ser removida está alocada
     * @param {number} posicao - posição da linha em que a peça está alocada
     */

    removePeca_porposicao(linha,posicao){
        let temp = null;
        if(this.memoria[linha][posicao] != null){
            temp = this.memoria[linha][posicao];
            for (let i = 0; i <this.tamanhodaslinhas; i++) {
                if (this.memoria[linha][i] === temp){
                    this.memoria[linha][i] = null;
                }
            }
        }
        return temp;
    }
    /**
     * Insere a peça especificada na linha e posicao desejada
     *
     * @param {Peca} peca - peça a ser inserida
     * @param {number} linha - linha de inserção da peça
     * @param {number} posicao - posição onde a peça será inserida
     */
    inserePeca(peca,linha,posicao){
        let temp = null;
        if(peca == novapeca){
            if(this.flagalocacao && peca.alocada != this && peca.tamanho/40+posicao <=this.tamanhodaslinhas){
                for (let i = posicao; (i<posicao+peca.tamanho/40) && (temp == null);i++){
                    temp = this.memoria[linha][i];
                }
                if(temp == null){
                    for (let i = posicao; i < posicao+peca.tamanho/40; i++) {
                        this.memoria[linha][i] = peca;
                    }
                    peca.alocada = this;
                    return true;
                }else{
                    return false;
                }
            }
        }else{
            if(peca.alocada != this && peca.tamanho/40+posicao <=this.tamanhodaslinhas){
                for (let i = posicao; (i<posicao+peca.tamanho/40) && (temp == null);i++){
                    temp = this.memoria[linha][i];
                }
                if(temp == null){
                    for (let i = posicao; i < posicao+peca.tamanho/40; i++) {
                        this.memoria[linha][i] = peca;
                    }
                    peca.alocada = this;
                    peca.imagem.clearTint();
                    return true;
                }else{
                    return false;
                }
            }
        }

        return false;
    }

    /**
     * Retorna a peça alocada na posição de memoria indicada;
     * Se não houver peça retorna null;
     *
     * @param {number} linha - linha da posição de memoria
     * @param {number} posicao - posição na linha de memória
     */
    getPeca(linha,posicao){
        return this.memoria[linha][posicao];
    }
    /**
     * Bloqueia a alocação de nova peça para não ocorrer conflito no estado de swap
     */
    bloquarAlocacao(){
        this.flagalocacao = false;
    }
    /**
     * Libera a alocação de nova peça
     */
    liberarAlocacao(){
        this.flagalocacao = true;
    }

    /**
     * Retirar uma peça da memoria e deleta ela visualmente do jogo
     * A liberação do espaço fisico na memoria do computador é feita pelo garbage colector
     *
     * @param {Peca} p - peça alocada a ser destruida
     */
    destruirPeca(p){
        this.removePeca(p);
        //resta implementar a remoção visual da peça;
    }
}

var cor;
var tamanho;
var algoritmo;
var pontos = 0;
var maxpontos = 0;
var novapeca = null;
var memoria = new Memoria('memoriaprincipal',5,10);
var gridMemPrincipal;
var swap = new Memoria('swap',5,6);
var gridSwap;
var soundstatus;
var soundimage;
var infoalgoritmo = null;
var infopontuacaopontos = null;
var melhorposicao;
var temporizador;
var flagtemporizador;
var musicas;
var tempodecorrido = 0;
var flagreg;
var regtempo=3;
var relogio;
var timedEvent;
var t1;
var t2;
var t3;
var t4;
//Variaveis de controle de fluxo
var estado = 0;
var moveupecapramemoria = false;
var moveupecadaswappramemoria = false;
var moveupecadamemoriapraswap = false;


class GameMemoria extends Phaser.Scene {
    constructor (){
        super('GameMemoria');
    }
    preload ()
    {
        //Carregando imagem do grid
        this.load.image('grid', 'img/memoria/grid.png');

        /**
         * Carregando imagens das peças
         */
        this.load.image('pecaazulpequena', 'img/memoria/azulpequena.png');
        this.load.image('pecaazulmedia', 'img/memoria/azulmedia.png');
        this.load.image('pecaazulgrande', 'img/memoria/azulgrande.png');

        this.load.image('pecavermelhapequena', 'img/memoria/vermelhapequena.png');
        this.load.image('pecavermelhamedia', 'img/memoria/vermelhamedia.png');
        this.load.image('pecavermelhagrande', 'img/memoria/vermelhagrande.png');

        this.load.image('pecaverdepequena', 'img/memoria/verdepequena.png');
        this.load.image('pecaverdemedia', 'img/memoria/verdemedia.png');
        this.load.image('pecaverdegrande', 'img/memoria/verdegrande.png');

        this.load.image('pecaamarelapequena', 'img/memoria/amarelapequena.png');
        this.load.image('pecaamarelamedia', 'img/memoria/amarelamedia.png');
        this.load.image('pecaamarelagrande', 'img/memoria/amarelagrande.png');

        this.load.image('pecaroxapequena', 'img/memoria/roxapequena.png');
        this.load.image('pecaroxamedia', 'img/memoria/roxamedia.png');
        this.load.image('pecaroxagrande', 'img/memoria/roxagrande.png');

        this.load.image('imagemdefundo','img/memoria/fundo.jpg');
        this.load.image('container1','img/memoria/container1.jpg');
        this.load.image('container2','img/memoria/container2.jpg');
        this.load.image('container3','img/memoria/container3.jpg');
        this.load.image('container4','img/memoria/container4.jpg');
        this.load.image('soundon','img/memoria/soundon.png');
        this.load.image('soundoff','img/memoria/soundoff.png');
        this.load.spritesheet('botaoVoltar', 'assets/botaoVOLTAR.png', {frameWidth: 200, frameHeight: 40});
        //this.load.audio('musicas', ['audio/TopGear1.mp3', 'audio/Tetris.mp3',]);
        this.load.audio('musicas', ['audio/Tetris.mp3']);

    }

    create ()
    {        
        musicas = this.sound.add('musicas');
        musicas.loop = true;
        musicas.play();   
        

        this.add.image(0,0,'imagemdefundo').setOrigin(0,0);
        this.add.image(520,80,'container2').setOrigin(0,0);
        this.add.image(520,220,'container1').setOrigin(0,0);
        this.add.image(520,300,'container4').setOrigin(0,0);
        soundimage=this.add.image(750,0,'soundon').setOrigin(0.0);
        soundimage.setInteractive();
        soundstatus=1;
        soundimage.on('pointerup', function (pointer) {
            alterasom(this.scene);
        });

        /**
         * Criação do grid de memória principal
         */
        gridMemPrincipal = this.add.group({
            classType: Phaser.GameObjects.Image,
            createCallback: function(item){
                item.setInteractive();
                item.input.dropZone = true;
                item.name = 'memoria';
            },
            key: 'grid',
            repeat: memoria.tamanhodaslinhas*memoria.numerodelinhas-1,
            max: memoria.tamanhodaslinhas*memoria.numerodelinhas,
            active: true,
            hitArea: new Phaser.Geom.Rectangle(0, 0, 40, 40),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            gridAlign: {
                width: memoria.tamanhodaslinhas,
                cellWidth: 40,
                cellHeight: 40,
                x: 80,
                y: 100
            }
        });

        /**
         * Grid Swap
         */
        gridSwap = this.add.group({
            classType: Phaser.GameObjects.Image,
            createCallback: function(item){
                item.setInteractive();
                item.input.dropZone = true;
                item.name = 'swap';
            },
            key: 'grid',
            repeat: swap.tamanhodaslinhas*swap.numerodelinhas-1,
            max: swap.tamanhodaslinhas*swap.numerodelinhas,
            active: true,
            hitArea: new Phaser.Geom.Rectangle(0, 0, 40, 40),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            gridAlign: {
                width: swap.tamanhodaslinhas,
                cellWidth: 40,
                cellHeight: 40,
                x: 80,
                y: 340
            }
        });

        // Exibe informações
        relogio = this.add.text(540,160, String(temporizador),{ fill: '#000000', fontFamily: 'font1' ,fontSize: 10})
        infoalgoritmo = this.add.text(580, 237, '', { fill: '#000000', fontFamily: 'font1' ,fontSize: 11 });
        this.add.text(600, 320, 'MENU', { fill: '#000000', fontFamily: 'font1' ,fontSize: 11 })
        this.add.text(570, 340, 'Pontuação:', { fill: '#000000', fontFamily: 'font1' ,fontSize: 11 });
        this.add.text(60,50,'MEMÓRIA PRINCIPAL',{ fill: '#000000', fontFamily: 'font1' ,fontSize: 15})
        this.add.text(60,290,'SWAP',{ fill: '#000000', fontFamily: 'font1' ,fontSize: 15})
        infopontuacaopontos = this.add.text(610, 360, String(pontos), { fill: '#000000', fontFamily: 'font1' ,fontSize: 11 });
        botaoVoltar = this.add.sprite(600, 500, 'botaoVoltar').setOrigin(0.5).setInteractive();
        botaoVoltar.on('pointerover', function(){
            this.setFrame(1);
        });
        botaoVoltar.on('pointerout', function(){
            this.setFrame(0);
        });
        botaoVoltar.on('pointerdown', function(){
            musicas.stop();
            estado = 0;
            this.scene.scene.stop(this.scene.key);
            this.scene.scene.start('menu');
        });

        //Cria Relogio
        temporizador = 3;
        flagtemporizador = false;
        timedEvent = this.time.addEvent({
            delay: 1000,
            callback: function () {
                tempodecorrido++;
                decrementarTempoDasPecas();
                if (flagtemporizador) {
                    temporizador--;
                    if(temporizador < 0){
                        decrementarPontos(10);
                    }
                }
            },
            timeScale: 1,
            loop: true,
            paused:true
        });
        flagreg = false;
        var contagemRegEvent = this.time.addEvent({
            delay:1000,
            callback: function (){
                if(flagreg){
                    if(regtempo>0){
                        regtempo--;
                    }
                }
            },
            timeScale: 1,
            loop: true,
        });
        this.events.emit('pronto');
    }

    update ()
    {
        /*
            Estrutura da máquina de estado do jogo
        */
        //Funções realizadas pelo evento timedEvent a cada segundo
            //Contabilizar o Tempo
            //Decrementar tempo de vida de cada peça na memoria
            //Decrementar tempo de peças em Swap
            //Acrescentar Pontos [se peça for destruida da memoria]
            //Decrementar Pontuação [se cronometro passar de 0]
        
        infopontuacaopontos.setText(pontos);
        if(regtempo==0){
        relogio.setText('Tempo Restante: ' + temporizador);
        }
        //Condição de fim de jogo
        if(pontos < 0){
            estado = 6;
        }
        if(pontos>maxpontos){
        maxpontos=pontos;
        }

        switch (estado) {
            case 0:
                //------Iniciar Jogo
                //Funçõe realizadas em creat
                //Exibir Memoria Vazia
                //Exibir Swap Vazia
                //Exibir Cronometro
                //Exibir Pontuação
            //Ainda falta implementar
            // Contagem Regressiva Para Iniciar Jogo
                relogio.setText('Clique para começar');
                memoria.clear();
                swap.clear();
                infoalgoritmo.setText();
                maxpontos=0;
                pontos=0;
                if(novapeca!=null){
                    novapeca.imagem.destroy();
                }
                if(game.input.activePointer.isDown){
                    flagreg=true;
                    regtempo=3;
                    estado = 1;
                }
                break;
            case 1:
                relogio.setText('Começando em ' + regtempo);
                if(regtempo==0){
                    timedEvent.paused = false;
                    estado = 2;
                }
                break;
            case 2:
                //------Mostrar Peça
                //Sorteia tamanho,cor e o algoritmo
                    sortearTamanhoCorEAlgoritmo();
                //Cria e Exibe peça
                    criarEExibirPeca(this);
                //Calcula algoritmo
                    infoalgoritmo.setText(algoritmo);
                    if (algoritmo == 'Bestfit') {
                        melhorposicao = bestFit(novapeca,memoria);
                    }else{
                        //worsrFit();
                        melhorposicao = worstFit(novapeca,memoria);
                    }
                //Zerar Temporizador
                    temporizador = 3;
                    timedEvent.elapsed = 0;
                    flagtemporizador = true;
                    estado = 3;
                break;
                /**
                 * Obs.: As funções relacionadas as peças como parar ou retomar a contagem de seu tempo de vida
                 * são realizadas no método "drop" atribuido a cada peça em sua criação,
                 * uma vez que não existe e não é necessário criar referências para acessa-las na função
                 * update. Sendo assim esses estados ficam de modo simbólico para representar a máquina
                 * de estados, para decrementar ou executar outras funções relacionadas ao movimento da peça
                 * e para alguma adaptação ou melhoria com mais funções no futuro.
                 */
            case 3:
                //------Esperando Jogada
                //Capturar Ação do jogador
                if(moveupecapramemoria){
                    moveupecapramemoria = false;
                    //Para temporizador
                    flagtemporizador = false;
                    estado = 2;
                }
                //Ainda falta implementação SWAP
                if(moveupecadaswappramemoria){
                    moveupecadaswappramemoria = false;
                    estado = 5;
                }
                if(moveupecadamemoriapraswap){
                    moveupecadamemoriapraswap = false;
                    estado = 4;
                }
                break;
            case 4:
                //------Fazer SwapOut
                //Parar tempo de vida da swap
                //Iniciar cronometro da peça na swap
                //Decrementar pontos do jogador
                decrementarPontos(10);
                estado = 3;
                break;
            case 5:
                //------Fazer SwapIn
                    //Zerar cronometro da peça na swap
                    //Continuar contagem do tempo de vida da peça
                    //Bloquear alocação de novas peças
                estado = 3;
                break;
            case 6:
                //------Fim de Jogo
                //Exibir fim de jogo
                //Mostrar Pontuação
                gameOver(this);
                pontos=0;
                timedEvent.paused = true;
                estado = 7;
                break;
            case 7:
            // Espera clicar para voltar ao inicio
            if(game.input.activePointer.isDown){
                clearGameOver();
                estado = 0;
            }
            default:
                break;
        }
    }
}
/**
 * Função responsável por alterar o som
 */
function alterasom(scene){   
 soundimage.destroy();
 if(soundstatus){
   soundimage = scene.add.image(750,0,'soundoff').setOrigin(0.0);
   soundimage.setInteractive();
   soundimage.on('pointerup', function (pointer) {
    alterasom(this.scene);
    });
   soundstatus=0;
   musicas.stop();
   //musicas.mute = true;
 }else{     
   soundimage = scene.add.image(750,0,'soundon').setOrigin(0.0);
   soundimage.setInteractive();
   soundimage.on('pointerup', function (pointer) {
    alterasom(this.scene);
    });
   soundstatus=1;
   musicas.play();
   //musicas.mute = false;
 }
}
/**
 * Função responsável por sortear Tamanho Cor e Algoritmo para a proxima peca a ser exibida
 * Os valores são armazenados nas variaveis globais cor tamanho e algoritmo
 */
function sortearTamanhoCorEAlgoritmo(){
    let i = Math.floor(Math.random() * 5);
    //vermelho
    if(i == 0){
        cor = 0xff0000;
    //verde
    }else if(i == 1){
        cor = 0x00ff00;
    //azul
    }else if(i == 2){
        cor = 0x0000ff;
    //amarela
    }else if(i == 3){
        cor = 0xe2f61a;
    //roxa
    }else if(i == 4){
        cor = 0x5a005a;
    }
    i = Math.floor(Math.random() * 2);
    if(i == 0){
        algoritmo = 'Bestfit';
    }else if(i == 1){
        algoritmo = 'Worstfit';
    }
    i = Math.floor(Math.random() * 3);
    if(i == 0){
        tamanho = 40;
    }else if(i == 1){
        tamanho = 80;
    }else if(i == 2){
        tamanho = 120;

    }
}

/**
 * Função responsável por instanciar e exibir uma nova peça com base nas informações das variaveis
 * cor e tamanho
 *
 * @param {Scene} scene -parametro que recebe o contexto do pelo qual está sendo chamado
 */
function criarEExibirPeca(scene){
    //instancia nova peça
    novapeca = new Peca(tamanho,cor);
    //Atribui uma imagem conforme a cor e tamanho da peça
    switch (cor) {
        case 0xff0000:
            if(novapeca.tamanho == 40){
                novapeca.imagem = scene.add.image(560, 100, 'pecavermelhapequena').setOrigin(0,0);
            }
            if(novapeca.tamanho == 80){
                novapeca.imagem = scene.add.image(560, 100, 'pecavermelhamedia').setOrigin(0,0);
            }
            if(novapeca.tamanho == 120){
                novapeca.imagem = scene.add.image(560, 100, 'pecavermelhagrande').setOrigin(0,0);
            }
            break;
        case 0x00ff00:
            if(novapeca.tamanho == 40){
                novapeca.imagem = scene.add.image(560, 100, 'pecaverdepequena').setOrigin(0,0);
            }
            if(novapeca.tamanho == 80){
                novapeca.imagem = scene.add.image(560, 100, 'pecaverdemedia').setOrigin(0,0);
            }
            if(novapeca.tamanho == 120){
                novapeca.imagem = scene.add.image(560, 100, 'pecaverdegrande').setOrigin(0,0);
            }
            break;
        case 0x0000ff:
            if(novapeca.tamanho == 40){
                novapeca.imagem = scene.add.image(560, 100, 'pecaazulpequena').setOrigin(0,0);
            }
            if(novapeca.tamanho == 80){
                novapeca.imagem = scene.add.image(560, 100, 'pecaazulmedia').setOrigin(0,0);
            }
            if(novapeca.tamanho == 120){
                novapeca.imagem = scene.add.image(560, 100, 'pecaazulgrande').setOrigin(0,0);
            }
            break;
        case 0xe2f61a:
            if(novapeca.tamanho == 40){
                novapeca.imagem = scene.add.image(560, 100, 'pecaamarelapequena').setOrigin(0,0);
            }
            if(novapeca.tamanho == 80){
                novapeca.imagem = scene.add.image(560, 100, 'pecaamarelamedia').setOrigin(0,0);
            }
            if(novapeca.tamanho == 120){
                novapeca.imagem = scene.add.image(560, 100, 'pecaamarelagrande').setOrigin(0,0);
            }
            break;
        case 0x5a005a:
            if(novapeca.tamanho == 40){
                novapeca.imagem = scene.add.image(560, 100, 'pecaroxapequena').setOrigin(0,0);
            }
            if(novapeca.tamanho == 80){
                novapeca.imagem = scene.add.image(560, 100, 'pecaroxamedia').setOrigin(0,0);
            }
            if(novapeca.tamanho == 120){
                novapeca.imagem = scene.add.image(560, 100, 'pecaroxagrande').setOrigin(0,0);
            }
            break;
        default:
            break;
    }

    //novapeca.imagem.name = 'novapeca';
    //Define um ponteiro da imagem para a peca a qual pertence
    novapeca.imagem.peca = novapeca;
    novapeca.imagem.setInteractive();
    //Habilita a ação de arrastar e tras a imagem para frente
    scene.input.setDraggable(novapeca.imagem);
    scene.children.bringToTop(novapeca.imagem);

    //Habilita de alinhamento. Para alinhar apenas quando a peça estiver sobre a area de memoria
    novapeca.imagem.on('dragenter',function (pointer,target) {
        this.peca.flagalinhamento = true;
    });
    //Alinha a peça conforme a posição do ponteiro do mouse
    novapeca.imagem.on('dragover',function (pointer,target) {
        this.setPosition(target.getTopLeft().x, target.getTopLeft().y);
    });
    //Move a peça normalmente quando a peça esta fora da area de memoria
    novapeca.imagem.on('drag', function (pointer, dragX, dragY) {
        if(!this.peca.flagalinhamento){
            this.setPosition(dragX, dragY);
        }
    });
    //Desabilita o alinhamento. Para deixar de alinhar quando a peça sair a da area de memoria
    novapeca.imagem.on('dragleave', function (pointer, target) {
        this.peca.flagalinhamento = false;
    });
    //Toda vez que a peça é solta ela deve voltar a sua posição de origem
    novapeca.imagem.on('pointerup', function (pointer) {
        this.setPosition(this.peca.origem.x,this.peca.origem.y);
    });

    //Função chamada sempre que a peça é largada em alguma posição de alguma memoria
    //Utilizada para definir qual foi a ação do jogador
    novapeca.imagem.on('drop',function (pointer, target) {
        //Se for solta na memoria principal
        if(target.name == 'memoria'){
            //Se o local da memoria é valido
            if(memoria.inserePeca(this.peca,(target.y-gridMemPrincipal.getFirstAlive().y+40)/40-1,(target.x-gridMemPrincipal.getFirstAlive().x+40)/40-1)){
                //Se é uma nova peça sendo solta na memoria ou se é uma peça da swap sendo solta na memoria
                if (this.peca === novapeca) {
                    novapeca.origem = {x: target.getTopLeft().x, y:target.getTopLeft().y};
                    if(verificarAcerto({x: (target.y-gridMemPrincipal.getFirstAlive().y+40)/40-1,y: (target.x-gridMemPrincipal.getFirstAlive().x+40)/40-1},melhorposicao)){
                        acrescentarPontos(15);
                    }else{
                        acrescentarPontos(5);
                    }
                    novapeca.flagtempodevida = true;
                    moveupecapramemoria = true;
                    novapeca = null;
                }else{
                    swap.removePeca(this.peca);
                    this.peca.origem = {x: target.getTopLeft().x, y:target.getTopLeft().y};
                    this.peca.temporizadorswap = this.peca.tempoemswap;
                    this.peca.flagtempoemswap = false;
                    this.peca.flagtempodevida = true;
                    memoria.flagalocacao = true;
                    moveupecadaswappramemoria = true;
                }
            }
        }else{
            //Se não for a nova peça
            if(this.peca != novapeca){

                if(swap.inserePeca(this.peca,((target.y-gridSwap.getFirstAlive().y+40)/40-1),((target.x-gridSwap.getFirstAlive().x+40)/40-1))){
                    this.peca.origem = {x: target.getTopLeft().x, y:target.getTopLeft().y};
                    memoria.removePeca(this.peca);
                    this.peca.flagalocada = true;
                    this.peca.flagtempodevida = false;
                    this.peca.flagtempoemswap = true;
                    moveupecadamemoriapraswap = true;
                }
            }
        }
        this.setPosition(this.peca.origem.x,this.peca.origem.y);
    });
}

/**
 * Função BestFit e Worstfit retorna um vetor de 3 posições com as melhores posições para alocar a peça
 * 1 posição são indices de linha e 2 posição são indices de onde iniciam os espaços vazios em cada linha
 * 3 posição é o tamanho do melhor espaço
 * Ex.: [[0,3],[2,5],3] significa que o tamanho do melhor espaço é 3 e existem dois
 * espaços na matriz com esse tamanho, um na linha 0 posição 2 e outro na linha 3 posição 5
 *
 * @param {Peca} peca - peça que será alocada
 * @param {Memoria} mem - memoria em que a peça será alocada
 */
 function worstFit(peca,mem){
      let piorescolha = [[],[],peca.tamanho/40];
      let tam = 0;
      for (let k = 0; k < mem.numerodelinhas; k++) {
          for (let i = 0; i < mem.tamanhodaslinhas; i++) {
              if(mem.memoria[k][i] == null){
                  let j = i;
                  while (j < mem.tamanhodaslinhas && mem.memoria[k][j] == null) {
                      j++;
                  }
                  tam=j-i;

                  if (tam > piorescolha[2]) {
                      piorescolha[0] = [k];
                      piorescolha[1] = [i];
                      piorescolha[2] = tam;
                  }else if(tam == piorescolha[2]){
                      piorescolha[0].push(k);
                      piorescolha[1].push(i);
                  }
                  i = j;
             }
         }
     }
     return piorescolha;
}
function bestFit(peca,mem){
    let melhorescolha = [[],[],mem.tamanhodaslinhas];
    let min = peca.tamanho/40;
    let inicio = 0;
    let tam = 0;
    for (let k = 0; k < mem.numerodelinhas; k++) {
        for (let i = 0; i < mem.tamanhodaslinhas; i++) {
            if(mem.memoria[k][i] == null){
                inicio = i;
                let j;
                for (j = i; j < mem.tamanhodaslinhas && mem.memoria[k][j] == null; j++) {
                    tam++;
                }
                i = j;
            }
            if(tam >= min){
                if(tam == melhorescolha[2]){
                    melhorescolha[0].push(k);
                    melhorescolha[1].push(inicio);
                }
                if (tam < melhorescolha[2]) {
                    melhorescolha[0] = [k];
                    melhorescolha[1] = [inicio];
                    melhorescolha[2] = tam;
                }
            }
            inicio = 0;
            tam = 0;
        }
    }
    return melhorescolha;
}

/**
 * Função responsável por verificar se a peça foi inserida em uma posição ideal conforme o algoritmo
 * indicado
 *
 * @param {Object} posicao - Objeto com posicao x e y das coordenas de onde a peça foi inserida
 * @param {Array} melhorescolha - Array com as melhores escolhas possiveis
 */
function verificarAcerto(posicao,melhorescolha){
    for (let i = 0; i < melhorescolha[0].length; i++) {
        if (melhorescolha[0][i] == posicao.x && melhorescolha[1][i] == posicao.y) {
            return true;
        }
    }
    return false;
}

function gameOver(scene){
  t4 = scene.add.image(400,300,'container3').setAlpha(0.75);
  t1 = scene.add.text(270, 220, 'Game Over', { fill: '#000000', fontFamily: 'font1', align:'center' ,fontSize: 30});
  t2 = scene.add.text(270, 300, 'Recorde: ' + maxpontos, { fill: '#000000', fontFamily: 'font1', align:'center' ,fontSize: 15});
  t3 = scene.add.text(270, 330, 'Clique para recomeçar', { fill: '#000000', fontFamily: 'font1', align:'center' ,fontSize: 15});
}

function clearGameOver(){
  t1.destroy();
  t2.destroy();
  t3.destroy();
  t4.destroy();
}


/**
 * Função que decrementa um numero de pontos
 * @param {number} pts
 */
function decrementarPontos(pts){
    pontos -= pts;
}

/**
 * Função que acrescenta um numero de pontos
 *
 * @param {number} pts
 */
function acrescentarPontos(pts){
    pontos += pts;
}

/**
 * Função que decrementa o tempo das peças e remove as da memoria quando acaba o tempo de vida
 */

function decrementarTempoDasPecas(){
    for (let i = 0; i < memoria.numerodelinhas; i++) {
        for (let j = 0; j < memoria.tamanhodaslinhas; j++) {
            if (memoria.memoria[i][j] != null) {
                memoria.memoria[i][j].tempodevida--;
                if (memoria.memoria[i][j].tempodevida <= 0) {
                    acrescentarPontos(5);
                    memoria.memoria[i][j].imagem.destroy();
                    for (let k = j+1; memoria.memoria[i][k] === memoria.memoria[i][j]; k++) {
                        memoria.memoria[i][k] = null;
                    }
                    memoria.memoria[i][j] = null;
                }else{
                    j+=memoria.memoria[i][j].tamanho-1;
                }
            }
        }
    }
    for (let i = 0; i < swap.numerodelinhas; i++) {
        for (let j = 0; j < swap.tamanhodaslinhas; j++) {
            if (swap.memoria[i][j] != null) {
                swap.memoria[i][j].temporizadorswap--;
                if(swap.memoria[i][j].temporizadorswap <= 0){
                    swap.memoria[i][j].imagem.setTint(0x5e5e5e);
                    memoria.flagalocacao = false;
                }else{
                    j+=swap.memoria[i][j].tamanho;
                }
            }
        }
    }
}
