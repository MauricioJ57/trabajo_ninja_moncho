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
        const cielo = this.add.image(0, 0, "cielo").setOrigin(0, 0);
        cielo.displayWidth = this.scale.width;
        cielo.displayHeight = this.scale.height;

        const ninja = this.add.image(100, 500, "ninja").setOrigin(0.5, 0.5);
        ninja.setScale(0.2, 0.2);
        this.physics.add.existing(ninja);

        const platform = this.add.image(400, 580, "platform")
            .setScale(2);
        this.physics.add.staticGroup(platform);
        this.physics.add.collider(ninja, platform,);

        const diamante = this.add.image(200, 300, "diamond");
        diamante.setScale(0.5, 0.5);
        this.physics.add.existing(diamante);
        this.physics.add.collider(diamante, platform,);

        const square = this.add.image(400, 300, "square");
        square.setScale(0.5, 0.5);
        this.physics.add.existing(square);
        this.physics.add.collider(square, platform,);

        const triangle = this.add.image(600, 300, "triangle");
        triangle.setScale(0.5, 0.5);
        this.physics.add.existing(triangle);
        this.physics.add.collider(triangle, platform,);

    }

    update() {
        // ejecuta acciones constantes dentro del juego
    }
}