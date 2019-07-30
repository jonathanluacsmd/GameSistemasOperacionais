const ALTURA = 600;
const LARGURA = 800;
const NUM_ESTEIRAS = 4;
const escalonamento = {
	FIFO: 1,
	SJF: 2,
	PRIORIDADE: 3
};

// window.onload = function(){
	// let config = {
	// 	type: Phaser.AUTO,
	// 	width: LARGURA,
	// 	height: ALTURA,
	// 	backgroundColor: '#9b9b9b',
	// 	physics: {
	// 		default: 'arcade'
	// 	}
	// };	
	// game = new Phaser.Game(config);
// }

var mudandoCaixa = false;
var indice = 0;
var selecionado = false;
var novaPosicao = 0;
var velocidadeCaixas;
var controleCaixa;
var numCaixas;
var possivelInserir = [];
var tempoSjf = 60000;
var jogando = false;
var eventoSjf;
var tempoSpawn;
var numeroDaCaixa = 0;
var timedEvent;
var arrumarEnvelhecer = false;
var caixas = [];
var eventosPrioridade = [];
var player;
var tempoEnvelhecimento;
var envelheceu = [];
var cursor;
var possivelRemover = true;
var botao;
var fila = [];
var esteiraImg = [];
var k, l; //contadores para implementar as esteiras
var m; //contador para movimentação do player
var p;	
var pontos;
var placar;
var gameOverTexto;
var somCaixa;
var somPersonagem;
var somGameOver;
var somFundo; //Eu sei que é musica, mas usei o termo 'som' para padronizar, o intuito é apenas mostrar que se trata se	
var somErro;
var somBotao;
var botaoPressionado;
var habilitaSom = true;	
var habilitaMusica = true;
var botaoVoltar;
var controlePontos;
var botaoMusica;
var botaoSom;





var paredeInvisivel = null;
var escalonamentoTexto;
var botaoFIFO;
var botaoSJR;
var botaoPRIORIDADE;

class jogo extends Phaser.Scene{
	constructor(){
		super({key:'jogo'});
	}
	init(modo){
		botao = modo.modo;
	}
    preload ()
    {
		this.load.spritesheet('player', 'assets/player.png', {frameWidth: 64, frameHeight: 64});
		this.load.spritesheet('esteira', 'assets/esteira.png', {frameWidth: 47, frameHeight: 14});
		this.load.spritesheet('botaoVoltar', 'assets/botaoVOLTAR.png', {frameWidth: 200, frameHeight: 40});
		this.load.spritesheet('MUSICA', 'assets/musicicon.png', {frameWidth: 17, frameHeight: 17});
        this.load.spritesheet('SOM', 'assets/soundicon.png', {frameWidth: 17, frameHeight: 17});
		this.load.image('parede', 'assets/parede.png');
		this.load.image('11', 'assets/red40x40.png');
		this.load.image('12', 'assets/red40x80.png');
		this.load.image('13', 'assets/red40x120.png');
		this.load.image('21', 'assets/green40x40.png');
		this.load.image('22', 'assets/green40x80.png');
		this.load.image('23', 'assets/green40x120.png');
		this.load.image('31', 'assets/purple40x40.png');
		this.load.image('32', 'assets/purple40x80.png');
		this.load.image('33', 'assets/purple40x120.png');
		this.load.audio('pegarCaixa', 'audio/pegarCaixa.wav');
		this.load.audio('moverPersonagem', 'audio/moverPersonagem.wav');
		this.load.audio('somGameOver', 'audio/gameOver.wav');
		this.load.audio('musicaFundo', 'audio/audioFundo.wav');
		this.load.audio('somErro', 'audio/somErro.wav');
		this.load.audio('beepBotao', 'audio/beepBotao.wav');
        this.load.audio('botaoPressionado', 'audio/botaoPressionado.wav');


		numeroDaCaixa = 0;
		k = 0;
		l = 1;
		m = 0;
		p = 0;
		pontos = 0;
		controlePontos = 0;
		placar = this.add.text(20,20, 'PONTUAÇÃO: ' + pontos, {font: '20px font1', color: '#000000	'});
		


	}

    create ()
    {			
		this.anims.create({
			key: 'correr',
			frames: this.anims.generateFrameNumbers('esteira', { start: 0, end: 7 }),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: 'parado',
			frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
			frameRate: 10,
			repeat: 0
		});
		this.anims.create({
			key: 'pegarCaixa',
			frames: this.anims.generateFrameNumbers('player', { start: 1, end: 4 }),
			frameRate: 10,
			repeat: 0
		});
		caixas = [];
		for(var i=0; i<NUM_ESTEIRAS; i++) {
			caixas[i] = [];
		}
		

		//criando animação da esteira
		for(let i = 0; i < 40; i++){
			var posx = k;
			var posy = (ALTURA/5)*l + 20;
			//Criar variavel para contar ate 9 e resetar quando for para 10;
			esteiraImg[i] = this.add.sprite(posx, posy, 'esteira').setOrigin(0,0);
			esteiraImg[i].setScale(LARGURA/600, ALTURA/300);
			esteiraImg[i].anims.play('correr', true);
			k += 47 * LARGURA/600;
			if(k == (47 * LARGURA/600 * 10)){
				k = 0;
				l++;
			}
		}

		somCaixa = this.sound.add('pegarCaixa');
		somPersonagem = this.sound.add('moverPersonagem');
		somGameOver = this.sound.add('somGameOver');
		somFundo = this.sound.add('musicaFundo');
		somErro = this.sound.add('somErro');
		somBotao = this.sound.add('beepBotao').setVolume(2);
        botaoPressionado = this.sound.add('botaoPressionado').setVolume(0.1);
		if(habilitaMusica)
			somFundo.play();
		botaoMusica = this.add.sprite(LARGURA - 20, 20, 'MUSICA').setOrigin(0.5);
		botaoSom = this.add.sprite(LARGURA - 40, 20, 'SOM').setOrigin(0.5);
		botaoMusica.setInteractive();
		botaoSom.setInteractive();
		if(!habilitaMusica)
            botaoMusica.setFrame(2);
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
                somFundo.play();
            else{
                somFundo.pause();
                botaoMusica.setFrame(2);
            }
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
        });
		

		paredeInvisivel = this.add.tileSprite(47 * LARGURA/600 * 10, 0, 1, ALTURA*2, 'parede'); //para bater com o fim da esteira
		player = this.physics.add.sprite(LARGURA*0.82,ALTURA/5, 'player');
		player.anims.play('parado', true);
		player.setScale(3);
		this.physics.add.existing(paredeInvisivel, true);
		
		//criando o player
		this.physics.add.existing(player, false);
		player.body.setCollideWorldBounds(true);
		player.body.setBounce(0,0);
		
		possivelInserir.push(true);
		possivelInserir.push(true);
		possivelInserir.push(true);
		possivelInserir.push(true);
		
		if(botao == escalonamento.SJF){
			velocidadeCaixas = 1500;
			tempoSpawn = 100000*3/velocidadeCaixas ;
			numCaixas = 19;
		    timedEvent = this.time.addEvent({ delay: tempoSpawn, callback: this.onEvent, callbackScope: this, repeat:numCaixas});
		}
			
		if(botao == escalonamento.FIFO || botao == escalonamento.PRIORIDADE) {
			velocidadeCaixas = 150;
			tempoSpawn = 100000*3/velocidadeCaixas ;
			timedEvent = this.time.addEvent({ delay: tempoSpawn, callback: this.onEvent, callbackScope: this, loop: true});
		}
		
		//Serve pra gerar o sistema de tempo pro envelhecimento, tem que envelhecer a cada 20 seg +- talvez atualize
		//o tempo em algum canto muito provavelemnte que não
		
		//A ideia resumida é, pras esteira 1,2,3 cria um evento de tempo, e esse evento ira ter seu tempo
		//resetado a cada envelhecimento na fila, se não tiver nada na esteira ele simplesmente fica parado
		//o envelheceu serve para verificar se algum dos eventos deve ser resetado
		
		if(botao == escalonamento.PRIORIDADE){
			tempoEnvelhecimento = Phaser.Math.RoundTo((940-75)/velocidadeCaixas) * 3000;
			eventosPrioridade.push(this.time.addEvent({ delay: tempoEnvelhecimento*2, callback: null, callbackScope: this, loop:true, paused: true}));
			eventosPrioridade.push(this.time.addEvent({ delay: tempoEnvelhecimento*2, callback: null, callbackScope: this, loop:true, paused: true}));
			eventosPrioridade.push(this.time.addEvent({ delay: tempoEnvelhecimento*2, callback: null, callbackScope: this, loop:true, paused: true}));
			envelheceu.push(false);
			envelheceu.push(false);
			envelheceu.push(false);
		}
		
		controleCaixa = this.time.addEvent({delay: 200, callback: this.voltarProducao, callbackScope: this, loop: true});
		
		
		//pedacinho que talvez não precisasse para fazer funcionar o envelhecimento, mas acabou funcionando
		//então não recomendo mexer
		//especialmente na zona que deve estar o código nas funções abaixo
		if(botao == escalonamento.PRIORIDADE)
			this.time.addEvent({ delay: 10, callback: this.envelhecer, callbackScope: this, loop:true});
			
		this.time.addEvent({ delay: 100, callback: this.habilitarRemocao, callbackScope: this, loop: true});
		gameOverTexto = this.add.text(LARGURA/2, ALTURA/2, 'Game Over!', {font: '80px font1', align: 'center', color: '#000000'});
		gameOverTexto.setOrigin(0.5);
        gameOverTexto.setVisible(false);
        botaoVoltar = this.add.sprite(LARGURA/2, ALTURA * 5/6, 'botaoVoltar').setOrigin(0.5);
		botaoVoltar.setVisible(false);
    }

	

    onEvent(){
		var esteira = this.esteirasDisponiveis();
		
		if(esteira == null) {
			this.gameOver();
			return;
		}
		esteira = esteira[Phaser.Math.Between(0, esteira.length-1)];
		
		var cor = Phaser.Math.Between(1, 3); 
        var tamanho = Phaser.Math.Between(1, 3); 
        var posicaoY = (ALTURA/5)*(esteira+1);
        var posicaoX = LARGURA/16;
		var img = null;

		//Variável temporária para concatenar o número equivalente a cor e ao tamanho
		var temp = String(cor) + String(tamanho);
		img = this.physics.add.image(posicaoX, posicaoY,  temp);

		//Inserindo a fisisca no corpo
		this.physics.add.existing(img, false);

		
		//definindo os parametros do corpo
		//velocidade, não ricocheteando, e podendo colidir com as bordas
		//da área de jogo, e com uma "parede invisivel"
		img.body.setVelocity(velocidadeCaixas,0);
		img.body.setBounce(0,0);
		this.physics.add.collider(img, paredeInvisivel);
		
		//Criando uma estrutura de dados que armazena o sprite, o tamanho e numero da caixa
		// o tamanho e numero da caixa vão ser usados para tornar mais fácil o escalonamento
		let caixa = {img: img, tamanho:tamanho, numeroDaCaixa: numeroDaCaixa};
		
		//inserindo a caixa na esteira que foi a definida
		numeroDaCaixa++;
		caixas[esteira].push(caixa);

		//Inserindo a caixa na fila, caso seja esse o modo de jogo
		if(botao == escalonamento.FIFO){
			this.inserirFila(caixa);
		}
		
		//definindo o sistema de colisão entre as caixas.
		for(let i=0; i<caixas[esteira].length-1; ++i)
			this.physics.add.collider(caixas[esteira][caixas[esteira].length-1].img, caixas[esteira][i].img);
    }
    
    // setHabilitaSom(tempSom){
	// 	habilitaSom = tempSom;
	// }

	// getHabilitaSom(){
	// 	return habilitaSom;
	// }

	// setHabilitaMusica(tempMusica){
	// 	habilitaMusica = tempMusica;
	// }

	// getHabilitaMusica(){
	// 	return habilitaMusica;
	// }

	
	//função que retorna qual esteira está disponivel para ser inserida uma caixa
	esteirasDisponiveis() {
		var temp = [];
		for(let i=0; i<NUM_ESTEIRAS; i++)
			if(caixas[i].length < 7 && possivelInserir[i])
				temp.push(i);
		if(temp.length == 0)
			return null;
		return temp;
	}
	
	//Função para a remoção padrão de alguma caixa, essa funççao é utilizada pro FIFO, cada método de escalonamento
	//tem um jeito de retira-las
	
	removerCaixa() {
        var esteira = Phaser.Math.RoundTo(player.y * 5 / ALTURA) - 1;
        controlePontos++;
		//Não tá removendo de nenhuma esteira, só uma posicação estranha
		//então retorne
		if(esteira < 0 || esteira > NUM_ESTEIRAS-1)
			return;
		// não tem nada na esteira então retorne
		if(caixas[esteira].length == 0)
			return;
		
		//¯\_(ツ)_/¯ precisa disso pq sim
		if(!caixas[esteira][0].img.body.immovable)
			return;
		
		//colocando a caixa removida para se mexer
		caixas[esteira][0].img.body.setVelocity(velocidadeCaixas*3, 0);
		caixas[esteira][0].img.x += 15;
		if((caixas[esteira][0] === this.lerFila()) && escalonamento.FIFO == botao){
			pontos++;
			this.removerFila();
			if(habilitaSom)
				somCaixa.play();
		}else{
			
			
			if(pontos == 0)
				this.gameOver();
			if(pontos > 9){
				pontos -= 10;
			}else{
				pontos = 0;
			}
			while(!(caixas[esteira][0] === fila[p]) && p != fila.length){
				p++;
			}	
			fila.splice(p, 1);
			somErro.play();
		}
		caixas[esteira].shift();
		
		//dando uma leve mexida pras caixas não entrarem uma na outra
		// e coisando a velocidade delas
		for(let i=0; i<caixas[esteira].length; ++i) { 
			caixas[esteira][i].img.body.setImmovable(false);
			caixas[esteira][i].img.x += caixas[esteira].length - i*2;
			caixas[esteira][i].img.body.setVelocity(velocidadeCaixas/(i*0.2+1),0);
		}				
	}

	//função que retorna a esteira de maior prioridade disponível, que será usado para comparar.
	//A maior prioridade fica na primeira esteira, e a menor na ultima esteira.
	//
	//Como as caixas só podem ser removidas caso já tenham parado, leia-se o IMMOVABLE(atributo que eu seto quando elas param).
	//é só ver da esteira 0 para a esteira 4 se existe alguma caixa que possa ser removida

	verificarMaiorPrioridade() {
		for(let i=0; i<NUM_ESTEIRAS; i++)
			if(caixas[i].length > 0)
				if(caixas[i][0].img.body.immovable)
					return i;
	}

	//função pra remoção das caixas nos escalonamento de fila de prioridade.
	//É exatamente igual a remoção padrão de caixas, com a diferença de verificar se a caixa removida está na  esteira certa
	// caso tenham dúvidas olhem o de cima, é a mesma coisa e deve ter os comentário de tudo la
	
	removerCaixaPrioridade() {
		var i = this.verificarMaiorPrioridade();
		
		var esteira = Phaser.Math.RoundTo(player.y * 5 / ALTURA) - 1;
		//Não tá removendo de nenhuma esteira, só uma posicação estranha
		//então retorne
		if(caixas[esteira].length == 0)
			return;
		
		if(!caixas[esteira][0].img.body.immovable)
			return;
		
		//trechinho que diz que a caixa removida foi a da esteira certa
		//basicamente igual a dizer i == esteira, só que de outro jeito,
		// usei esse simplesmente pq quis
		
		if((i-esteira) != 0)
			this.gameOver();
			
		else {
			caixas[esteira][0].img.body.setVelocity(velocidadeCaixas*3, 0);
			caixas[esteira][0].img.x += 15;
			if(habilitaSom)
				somCaixa.play();
			
			pontos++;

			caixas[esteira].shift();
			
			//dando uma leve mexida pras caixas não entrarem uma na outra
			// e coisando a velocidade delas
			for(let i=0; i<caixas[esteira].length; ++i) { 
				caixas[esteira][i].img.body.setImmovable(false);
				caixas[esteira][i].img.x += caixas[esteira].length - i*2;
				caixas[esteira][i].img.body.setVelocity(velocidadeCaixas/(i*0.2+1),0);
			}				
			
		}
	}
	//
	//função que indica se os elementos estão ordenados pelo critério de tamanho
	//usa pra remoção do escalonamento de SJF, 

	isSorted(indice) {
		var ultimoTamanhoLido = caixas[indice][0].tamanho;
		for(let i=1; i<caixas[indice].length; i++){
			//foram de ordem retorna falso
			if(caixas[indice][i].tamanho < ultimoTamanhoLido)
				return false;
			
			if(caixas[indice][i].tamanho > ultimoTamanhoLido){
				ultimoTamanhoLido = caixas[indice][i].tamanho;
				pontos++;
			}
				
		}
		//se chegou até aqui, é pq tá tudo susse
		return true;
	}

	//função que remove todas as caixas de uma esteira

	removerEsteira() {
		var esteira = Phaser.Math.RoundTo(player.y * 5 / ALTURA) - 1;
		//Não tá removendo de nenhuma esteira, só uma posicação estranha
		//então retorne
		if(esteira < 0 || esteira > NUM_ESTEIRAS-1)
			return;
		// não tem nada na esteira então retorne
		if(caixas[esteira].length == 0)
			return;
		
		//só confia que funciona certo, a ideia que eu queria é que a velocidade das caixas fossem alta mesmo
		//pra dar a ideia de colocar tudo pra processar, meio que como era no escalonamento em lote.
		if(this.isSorted(esteira)) {
			for(let i=0; i<caixas[esteira].length; i++) {
				//deixa elas com uma velocidade, o setBounce talvez seja inutil, e fazem elas acelerar
				//a parte delas acelerarem é importante, pois elas param quando colidem em algo
				//mas a aceleração é mantida
				caixas[esteira][i].img.body.setVelocity(velocidadeCaixas, 0).setBounce(-1,0).setAcceleration(velocidadeCaixas*10,0);
			}
			//limpa a caixa
			caixas[esteira].length = 0;
			somCaixa.play();
			pontos += 10;
		}
		else{
			//não tá ordenado então acabou o JOGO
			this.gameOver();
			//remoção porca das caixas
			//coloca elas pra fora da tela
			//na função update elas são removidas, então relaxa (linha 689)
			for(let i=0; i<NUM_ESTEIRAS; i++) {
				for(let j=0; j<caixas[i].length; j++) {
					caixas[i][j].img.body.x = 5000;
				}
			}
		}
	}

	//função de gambiarra pra evitar tirar mais de uma caixa acidentalmente
	//é uma flag que é atualizada por um evento de tempo

	habilitarRemocao() {
		if(!possivelRemover)
			possivelRemover = true;
	}
	
	//checa se tudo esta vazio
	//util pro SJF pra ver se pode começar uma nova rodada, ou se chama o Gameover
	
	isEmpty() {
		for(let i =0; i<NUM_ESTEIRAS; i++)
			if(caixas[i].length != 0)
				return false;
		return true;
	}

	gameOver(){
		gameOverTexto.setVisible(true);
        timedEvent.remove();
        somFundo.pause();
		botaoVoltar.setInteractive();
		botaoVoltar.setVisible(true);
		if(habilitaSom)
			somGameOver.play();
		var temp = habilitaSom;
		habilitaSom = false;
		botaoVoltar.on('pointerover', function(){
			botaoVoltar.setFrame(1);
			if(habilitaSom)
            	somBotao.play();
        });
        botaoVoltar.on('pointerout' , function(){
            botaoVoltar.setFrame(0);
        });
        botaoVoltar.on('pointerdown' , function(){
			for(var i=0; i<NUM_ESTEIRAS; i++ )
				caixas[i].length = 0;
			fila.length = 0;
			// velocidadeCaixas = VELOCIDADEINICIAL;
			// botaoPressionado.play();
			somGameOver.stop();
			habilitaSom = temp;

			this.scene.scene.start('GameProcessos');
			
        });
	}
	
	//função pra trocar a posicao das imagens das caixas
	//obrigatoriamente tem que mante a ordem
	//caixa da esquerda tem que ficar na esquerda, e a da direita na direita
	
	//só manipulação do tamanho das caixas
	//o centro delas fica exatamente no meio, por isso tem os width/
	troque(esq, dir){
		esq.img.x = dir.img.x - dir.img.width/2 + esq.img.width/2;
		dir.img.x += esq.img.width;
	}
	
	
	//função que indica em qual pixel eu vou inserir a caixa que eu envelhecer
	//se tiver vazia a esteira coloca como se fosse uma nova caixa
	
	//se tiver algo, coloca um pouco pra tras da ultima caixa
	coordenadas(esteira) {
		var posicaoY, posicaoX;
		posicaoY = 120 + 120* (esteira-1);
		if(caixas[esteira-1].length == 0)
			posicaoX = LARGURA/16;
		else
			posicaoX = caixas[esteira-1][caixas[esteira-1].length-1].img.body.x - caixas[esteira-1][caixas[esteira-1].length-1].img.body.width/2 - caixas[esteira][0].img.body.width/2;
		
		if(esteira == 0)
			return;
		
		var retorno = {posX: posicaoX, posY: posicaoY};
		return retorno;
	}
	
	//Eu tento evitar colocar uma caixa envelhecida dentro de outra caso de spwan
	//aparentemente funciona bem decentemente
	//um evento de tempo
	//faz com que eu possa voltar a inserir caixas
	//as pausas são de 200ms e estão na variavel controleCaixa
	
	voltarProducao() {
		timedEvent.pause = false;
	}
	
	
	//Aqui tem uma mistura de mudança de lugar de caixas, com quase remoçoes
	//a parte realmente essencial é o timedEvent resetando o parametro de tempo passado
	//e pausando o evento até que ele possa ser ativo por conta do voltar produção
	
	//essa função é chamada constantemente por um evento de tempo(10ms) mas só executa quando o arrumar Envelhecer é true
	//ou seja a pessoa apertou S
	envelhecer() {
		if(arrumarEnvelhecer) {
			timedEvent.elapsed = 0;
			timedEvent.pause = true;
			controleCaixa.elapsed = 0;
			var esteira = Phaser.Math.RoundTo(player.y * 5 / ALTURA) - 2;
			
			//setando a flag pra resetar o timer do evento de game over por não envelhecer
			//ou na linguagem de SO o teu processo ter dado um straving
			envelheceu[esteira] = true;
			esteira++;
			//se for a esteira 0 não tem pq envelhecer, e nem pq envelhecer um esteira que não tem nada
			if(esteira == 0 || caixas[esteira].length == 0)
				return;
			
			var coord = this.coordenadas(esteira);

			//se por algum motivo tiver paralelismo, não vao inserir na esteira que eu quero
			//deve ser inutil esse pedaço, por conta do tratamento pelos eventos, mas né ¯\_(ツ)_/¯
			possivelInserir[esteira-1] = false;
			
			
			//mudando a posicao da caixa pra nova esteira, e fazendo ela se mexer como se fosse acabada de inserir
			caixas[esteira][0].img.x = coord.posX;
			caixas[esteira][0].img.y = coord.posY;
			caixas[esteira][0].img.body.setVelocity(velocidadeCaixas, 0);

			//colocando a caixa na nova esteira
			//shift retira o primeiro elemnento do array
			//push coloca no ultimo lugar
			caixas[esteira-1].push(caixas[esteira].shift());
			
			//meio a ideia que tem quando uma caixa é removida
			//coloca elas para andar com essas viadage pra uma não entrar na outra
			for(let i=0; i<caixas[esteira].length; ++i) { 
				caixas[esteira][i].img.body.setImmovable(false);
				caixas[esteira][i].img.x += caixas[esteira].length - i*2;
				caixas[esteira][i].img.body.setVelocity(velocidadeCaixas/(i*0.2+1),0);
			}
			//adicionando a fisica da caixa que mudou de esteira com as outras da esteira de cima
			for(let i=0; i<caixas[esteira-1].length-1; ++i)
				this.physics.add.collider(caixas[esteira-1][caixas[esteira-1].length-1].img, caixas[esteira-1][i].img);
			possivelInserir[esteira-1] = true;
			arrumarEnvelhecer = false;
		}
	}
	
    update(){
		
		//não tem segredo aperta espaço remove uma caixa de acordo com a regra
		//o mudando caixa indica se não estou mexendo na posição das caixas no caso do SJF
		
		if(Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)) && !mudandoCaixa) {
			if(possivelRemover && (escalonamento.FIFO == botao)){
				this.removerCaixa();
				possivelRemover = false;
				player.anims.play('pegarCaixa');
			}
			
			if(possivelRemover && escalonamento.SJF == botao) {
				this.removerEsteira();
				player.anims.play('pegarCaixa');
			}
			
			if(possivelRemover && escalonamento.PRIORIDADE == botao) {
				this.removerCaixaPrioridade();
				player.anims.play('pegarCaixa');
			}
			
		}

		
		//se tiver mudadno a caixa de lugar ativa o S
		//navega com as setas pra esquerda e para a direita para selecionar a caixa
		//em seguida aperta s, pra segurar a caixa e meer ela de lugar, aperta s de novo e coloca ela no lugar que vc quer
		//quando faz isso volta pra primeira posição pra poder mexer entre as caixas de novo
		if(Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S))) {
			if(botao == escalonamento.SJF  && mudandoCaixa){
				if(!selecionado)
					selecionado = true;
				else {
					selecionado = false;
					//tudo que tem body.y é so pra deixar bonitinho
					caixas[m][indice].img.body.y = (m+1)*(ALTURA/5)-20;
					//qunado termina de mexer ordena pela posicao X do sprite
					caixas[m].sort(function(a, b){return b.img.x-a.img.x;});
					indice = 0;
					novaPosicao = 0;
					caixas[m][0].img.body.y = caixas[m][1].img.body.y-40;
				}
			}
			//se tiver outra animação pro envelhecimento podem colocar
			//ela fica aqui
			if(botao == escalonamento.PRIORIDADE) {
				arrumarEnvelhecer = true;
				player.anims.play('pegarCaixa');
			}
		}
			
		//o mudando caixa impede que o personagem possa mover pra cima ou para baixo
		if(Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)) && !mudandoCaixa){
			if(m == 3){
				return;
			}
			m++;
            player.body.position.y = m * ALTURA/5;
            if(habilitaSom)
				somPersonagem.play();
		}
		if(Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)) && !mudandoCaixa){
			if(m == 0){
				return;
			}
			m--;
            player.body.position.y = m * ALTURA/5;
            if(habilitaSom)
				somPersonagem.play();
		}
		
		
		//aperta enter pra entrar no modo de mudar a caixas de posicao
		if(escalonamento.SJF) {
			if(Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER))) {
				if(!mudandoCaixa){
					if(caixas[m].length > 1) {
						caixas[m][0].img.body.y -= 40;
						mudandoCaixa = true;
					}
				}
				else{
					caixas[m][0].img.body.y = (m+1)*(ALTURA/5)-20;
					mudandoCaixa = false;
				}
			}
		}
		
		
		//troca a caixa de posicao com a caixa da esquerda
		//if(!selecionado) é pro antes de apertar S pela primeira vez
		if(Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)) && mudandoCaixa) {
			if(!selecionado) {
				if(indice < caixas[m].length-1){
				indice++;
				novaPosicao = indice;
				caixas[m][indice].img.body.y -= 40;
				caixas[m][indice-1].img.body.y += 40;
				}
			}
			else{
				if(novaPosicao < caixas[m].length-1){
					novaPosicao++;
					this.troque(caixas[m][indice], caixas[m][novaPosicao]);
					indice = novaPosicao;
					caixas[m].sort(function(a, b){return b.img.x-a.img.x;});
					
				}
			}
			
		}
		
		//troca a caixa com a da direita
		// o mesmo aqui
		if(Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)) && mudandoCaixa) {
			if(!selecionado) {
				if(indice > 0){
				indice--;
				novaPosicao = indice;
				caixas[m][indice].img.body.y -= 40;
				caixas[m][indice+1].img.body.y += 40;
				}
			}
			else{
				if(novaPosicao > 0){
					novaPosicao--;
					this.troque(caixas[m][novaPosicao], caixas[m][indice]);
					indice = novaPosicao;
					caixas[m].sort(function(a, b){return b.img.x-a.img.x;});
				}
			}
		}
		//atualizar o placar de pontuação
		placar.setText([
			'PONTUAÇÃO: ' + pontos
		]);

		//brincadeira para acelerar a velocidade das caixas,
		// e diminuir o tempo de spawn de cada uma delas
		// pra mudar quantas caixas devem ser coisadas é só mexer no modulo
		//o 650 é uma velocidade que não vai ter caixa dentro uma da outra, e ainda é rápida para ser dificil
		if(timedEvent.getRepeatCount() % 2 == 0 && velocidadeCaixas < 650 && !gameOverTexto.visible &&
		  ( botao == escalonamento.FIFO || botao == escalonamento.PRIORIDADE)){
			velocidadeCaixas += 2;
			//conta pro tempo de spawn, totalmente empirico, funciona ¯\_(ツ)_/¯
			tempoSpawn = 100000*3/velocidadeCaixas;
			
			//o tempo de envelhecimento é 3 vezes o tempo que a caixa normalemnte levaria para poder ser removida
			tempoEnvelhecimento = Phaser.Math.RoundTo((940-75)/velocidadeCaixas) * 3000;
			timedEvent.remove();
			timedEvent = this.time.addEvent({ delay: tempoSpawn, callback: this.onEvent, callbackScope: this, loop: true});
		}
		
		
		//todas as caixas foram spawnadas pro SJF, então a pessoa pode jogar
		if(timedEvent.getRepeatCount() == 0 && botao == escalonamento.SJF && !jogando) {
			eventoSjf = this.time.addEvent({ delay: tempoSjf, callback: this.onEvent, callbackScope: this, repeat:1});
			jogando = true;
		}
		
		//aqui é o seguinte
		//acabou o tempo da pessoa, mas ainda sou bonzinho
		//eu vejo se as ultimas coisas ainda estão ordenadas, mesmo que ela não tenha mandado remover
		//se tiver tudo certo, de boinha
		//se não ja era
		if(botao == escalonamento.SJF) {
			if(eventoSjf != null){
				if(eventoSjf.getRepeatCount() == 0){
					for(let i=0; i<NUM_ESTEIRAS; i++)
						this.removerEsteira(indice);
					eventoSjf.remove();
					jogando = false;
					timedEvent.remove();
					timedEvent = this.time.addEvent({ delay: tempoSpawn, callback: this.onEvent, callbackScope: this, repeat: numCaixas});
				}
			}
		}
		
		
		//avançando o estágio do SJF
		if(this.isEmpty() && !gameOverTexto.visible && botao == escalonamento.SJF && timedEvent.getRepeatCount() == 0) {
			timedEvent.remove();
			//30 seg talvez fique pouco
			//a ideia é reduzir o tempo de 1 min até 30 seg
			// chegou em 30 seg aumenta em 1 o número de caixas
			//volta o tempo pra 45 seg
			if(tempoSjf < 30000 && numCaixas < 30) {
					numCaixas++;
					tempoSjf = 45000;
				
			}
			else if(tempoSjf > 35000)
					tempoSjf -= 5000;
			else
				tempoSjf = 30000;
				
			timedEvent = this.time.addEvent({ delay: tempoSpawn, callback: this.onEvent, callbackScope: this, repeat: numCaixas});
		}
		
		//checa se dá para remover os evento de tempo de game over por conta do envelhecimento
		for(let i =0; i<envelheceu.length; i++) {
			if(envelheceu[i]){
				envelheceu[i] = false;
				eventosPrioridade[i].remove();
				eventosPrioridade[i] = null;
			}	
		}
		
		
		for(let i=0; i<eventosPrioridade.length; i++) {
			// cria eventos de envelhecimento
			if(eventosPrioridade[i] == null)
					eventosPrioridade[i] = this.time.addEvent({ delay: tempoEnvelhecimento*2, callback: null, callbackScope: this, loop: true});
			
				//tem algo na esteira e passou maior tempo do que o tempo de envelhecimento
				//ja era
				
				//caso tenha dado pau, tirem o *2 de todos os delays
				//mas não deve dar
			if(caixas[i+1].length > 0){
				if(eventosPrioridade[i].getElapsedSeconds() >= tempoEnvelhecimento){
					this.gameOver();
					return;
				}
			}
			
		}
		
		//Esse trecho é necessário, pois caso as caixas comecem a se agrupar em uma
		//esteira, a chance de que alguma venha a atravessar a outra é bem grande
		//é problema do framework, mas isso resolve meio que.
		//só vai dar um pouco de dor de cabeça depois para fazer a remoção
		for(let i=0; i<NUM_ESTEIRAS; i++)
			for(let j=caixas[i].length-1; j>=0; j--) { 
				if(caixas[i][j].img.body.touching.right) {
					caixas[i][j].img.body.setImmovable(true);
					caixas[i][j].img.body.stop();
				}
				//removendo da esteira se já saiu do mapa
				// so pra ficar bonitinho saindo da área
				if(caixas[i][j].img.x <= 0) {
					caixas[i][j].img.destroy();
					caixas[i].splice(j,1);
				}
			}
		
    }
    inserirFila(valor){
		fila[fila.length] = valor;
	}
	removerFila(){
		if(fila.length > 0){
			var obj = fila[0];
			fila.splice(0,1);
			return obj;    
		}else{
			console.log("Não há objetos na fila.");
		}
	}
	lerFila(){
		if(fila.length > 0){
			return fila[0];
		}else{
			console.log("Não há objetos na fila.");
		}
	}	
};
