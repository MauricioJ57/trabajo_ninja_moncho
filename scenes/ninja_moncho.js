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
    }

    create() {
        this.add.image(400, 300, "cielo").setOrigin(0.5, 0.5).setScale(2);

        this.platforms = this.physics.add.staticGroup(); // se asigna los grupos de plataformas

        this.platforms.create(400, 580, "platform").setScale(2).refreshBody();

        this.platforms.create(25, 350, "platform");
        this.platforms.create(775, 350, "platform");
        this.platforms.create(400, 150, "platform");

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

        this.diamond = this.physics.add.sprite(200, 300, "diamond").setScale(0.5); //se añaden los objetos de puntos

        this.diamond.setCollideWorldBounds(true);

        this.square = this.physics.add.sprite(400, 300, "square").setScale(0.5);

        this.square.setCollideWorldBounds(true);

        this.triangle = this.physics.add.sprite(600, 300, "triangle").setScale(0.5);

        this.triangle.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.platforms); //se añaden los colliders entre objetos

        this.physics.add.collider(this.diamond, this.platforms);

        this.physics.add.collider(this.square, this.platforms);

        this.physics.add.collider(this.triangle, this.platforms);

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

    }

    update() {
        if (this.cursors.left.isDown) { //se asigna los controles de direccion
            this.player.setVelocityX(-160);

        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

        } else {
            this.player.setVelocityX(0);

        } if (this.restartKey.isDown) {
            this.scene.start("HelloWorldScene")
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);

        }
        // ejecuta acciones constantes dentro del juego
    }

    collectDiamond(player, diamond) {
        diamond.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    collectSquare(player, square) {
        square.disableBody(true, true);

        this.score += 2;
        this.scoreText.setText(`Score: ${this.score}`);
    }
    
    collectTriangle(player, triangle) {
        triangle.disableBody(true, true);

        this.score += 5;
        this.scoreText.setText(`Score: ${this.score}`);
    }
}