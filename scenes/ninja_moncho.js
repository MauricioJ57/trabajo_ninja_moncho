export default class ninja_moncho extends Phaser.Scene {
    constructor() {
        super("ninja_moncho"); // se asigna el nombre de la escena
    }

    init() {
        // asignar las varianbles para poder pasarlas entre escenas
    }

    preload() {
        // precarga las imagenes para que se ejecuten antes de que se cargue la escena
        this.load.image("cielo", "public/assets/Cielo.webp");
        this.load.image("platform", "public/assets/platform.png");
        this.load.image("diamond", "public/assets/diamond.png");
        this.load.image("ninja", "public/assets/Ninja.png");
        this.load.image("square", "public/assets/square.png");
        this.load.image("triangle", "public/assets/triangle.png");
        this.load.image("objeto nuevo", "public/assets/objeto nuevo.png");
    }

    create() {
        this.add.image(400, 300, "cielo").setOrigin(0.5, 0.5).setScale(2);

        this.platforms = this.physics.add.staticGroup(); // se asigna los grupos de plataformas

        this.platforms.create(400, 580, "platform").setScale(2).refreshBody();

        this.platforms.create(25, 350, "platform");
        this.platforms.create(775, 350, "platform");

        this.player = this.physics.add.sprite(100, 480, "ninja").setScale(0.15); //se añade el personaje

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys(); // se crean los contorles de movimiento
        this.restartKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.R
        );

        this.score = 0;
        this.timer = 45;
        this.gameOver = false;

        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`,{
            fontSize: "32px",
            fill: "#fff",
        })

        this.gameOverText = this.add.text(400, 300, "Game Over", {
            fontSize: "64px",
            fill: "#fff",
        }).setOrigin(0.5, 0.5);
        this.gameOverText.visible = false;

        this.timertext = this.add.text(16, 45, `Time: ${this.timer}`, {
            fontSize: "32px",
            fill: "#fff",
        })

        this.recolectables = this.physics.add.group()

        this.spawnShapes = this.time.addEvent({
            delay: 1000,
            callback: () => {
                const figuras = ["diamond", "square", "triangle"]

                const shape = this.recolectables.create(Phaser.Math.Between(32, 800), 0, Phaser.Math.RND.pick(figuras))
                const scale = Phaser.Math.FloatBetween(0.3, 0.7)
                console.log(scale)
                shape.setScale(scale)
            },
            loop: true
        })

        this.objetonuevo = this.physics.add.group()

        this.spawnNewObject = this.time.addEvent({
            delay: 1000,
            callback: () => {
                const circle = ["objeto nuevo"]

                const shapeC = this.objetonuevo.create(Phaser.Math.Between(32, 800), 0, Phaser.Math.RND.pick(circle))
                const scaleC = Phaser.Math.FloatBetween(0.3, 0.7)
                console.log(scaleC)
                shapeC.setScale(scaleC)
            } // Aplicar y seguir con este metodo desde ahora y acordarse de revisar con la consola de desarrollador
        })

        this.diamond = this.physics.add.sprite(200, 100, "diamond").setScale(0.5).setBounce(1); //se añaden los objetos de puntos

        this.square = this.physics.add.sprite(400, 100, "square").setScale(0.5).setBounce(1);

        this.triangle = this.physics.add.sprite(600, 100, "triangle").setScale(0.5).setBounce(1);

        this.circulo = this.physics.add.sprite(700, 100, "objeto nuevo").setScale(0.13).setBounce(1);

        this.physics.add.collider(this.player, this.platforms); //se añaden los colliders entre objetos

        this.physics.add.collider(this.recolectables, this.platforms);

        this.physics.add.collider(this.square, this.platforms);

        this.physics.add.collider(this.triangle, this.platforms);

        this.physics.add.collider(this.circulo, this.platforms);

        this.physics.add.overlap(
            this.player,
            this.recolectables,
            this.collectRecolectables,
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.diamond,
            this.collectDiamond,
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.square,
            this.collectSquare,
            null,
            this
        );

        this.physics.add.overlap( // permite que el personaje pueda pasar sobre los objetos
            this.player,
            this.triangle,
            this.collectTriangle,
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.circulo,
            this.collectCirculo,
            null,
            this
        );

    }

    update() {
        if (this.cursors.left.isDown) { //se asigna los controles de direccion
            this.player.setVelocityX(-160);

        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

        } else {
            this.player.setVelocityX(0);

        } if (this.restartKey.isDown) {
            this.scene.start("ninja_moncho")
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);

        }
    }

    collectDiamond(player, diamond) {
        diamond.disableBody(true, true);

        this.score += 20;
        this.scoreText.setText(`Score: ${this.score}`);

        if (this.diamond.body.touching.down) {
            this.score -= 5;
            this.scoreText.setText(`Score: ${this.score}`);
        }
    }

    collectSquare(player, square) {
        square.disableBody(true, true);

        this.score += 15;
        this.scoreText.setText(`Score: ${this.score}`);

        if (this.square.body.touching.down) {
            this.score -= 5;
            this.scoreText.setText(`Score: ${this.score}`);
        }
    }
    
    collectTriangle(player, triangle) {
        triangle.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);

        if (this.triangle.body.touching.down) {
            this.score -= 5;
            this.scoreText.setText(`Score: ${this.score}`);
        }
    }

    collectCirculo(player, circulo) {
        circulo.disableBody(true, true);

        this.score -= 5;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    collectRecolectables(player, recolectables) {
        recolectables.disableBody(true, true);

        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    contador() {
        this.timer = 45;
        this.timertext.addEvent({
            delay: 1000,
            callback: () => {
                if (this.timer > 0) {
                    this.timer--;
                }
                if (this.timer === 0) {
                    this.gameOver = true;
                    this.physics.pause();
                    this.gameOverText.visible = true;
                }
            },
            loop: true,
        });
    }
}