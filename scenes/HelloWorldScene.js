export default class HelloWorldScene extends Phaser.Scene {
    constructor() {
        super("HelloWorldScene");
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

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 580, "platform").setScale(2).refreshBody();

        this.player = this.physics.add.sprite(100, 480, "ninja").setScale(0.2);

        this.player.setBounce(0,1);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.diamond = this.physics.add.sprite(200, 300, "diamond").setScale(0.5);

        this.diamond.setCollideWorldBounds(true);

        this.square = this.physics.add.sprite(400, 300, "square").setScale(0.5);

        this.square.setCollideWorldBounds(true);

        this.triangle = this.physics.add.sprite(600, 300, "triangle").setScale(0.5);

        this.triangle.setCollideWorldBounds(true);

    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        }
        // ejecuta acciones constantes dentro del juego
    }
}