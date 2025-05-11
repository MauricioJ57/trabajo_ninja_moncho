export default class ninja_moncho extends Phaser.Scene {
    constructor() {
        super("ninja_moncho"); // se asigna el nombre de la escena
    }

    init() {
       this.score = 0;
       this.timer = 45; // asignar las varianbles para poder pasarlas entre escenas
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

        this.victoryText = this.add.text(400, 300, "Ganaste", {
            fontSize: "64px",
            fill: "#fff",
        }).setOrigin(0.5, 0.5);
        this.victoryText.visible = false;

        this.timeleft = this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.timer > 0) {
                   this.timer --;
                   this.timertext.setText(`Time: ${this.timer}`); 
                }
                if (this.timer <= 0 && !this.gameOver) {
                    this.gameOver = true;
                    this.physics.pause();
                    this.gameOverText.visible = true;
                    this.restartKey.enabled = true;
                }
            },
            loop: true,
        });
        this.diamond = "diamond";

        this.square = "square";

        this.triangle = "triangle";

        this.circulo = "objeto nuevo";

        this.recolectables = this.physics.add.group();

        this.spawnShapes = this.time.addEvent({
            delay: 500,
            callback: () => {
                const figuras = {
                    diamond: { value: 15 },
                    square: { value: 10 },
                    triangle: { value: 5 }
                };

                const figuraKeys = Object.keys(figuras);
                const figuraSeleccionada = Phaser.Math.RND.pick(figuraKeys);
                const shape = this.recolectables.create(Phaser.Math.Between(32, 800), 0, figuraSeleccionada);
                shape.setData('value', figuras[figuraSeleccionada].value);
                const scale = Phaser.Math.FloatBetween(0.2, 0.5);
                shape.setScale(scale);
                shape.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            },
            loop: true
        });

        this.newobject = this.physics.add.group();

        this.spawnnewobject = this.time.addEvent({
            delay: 500,
            callback: () => {
                const circle = [this.circulo];

                const shapeCircle = this.newobject.create(Phaser.Math.Between(32, 800), 0, Phaser.Math.RND.pick(circle))
                const scaleCircle = Phaser.Math.FloatBetween(0.1, 0.2);
                shapeCircle.setScale(scaleCircle);
                shapeCircle.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            },
            loop: true
        });

        this.physics.add.collider(this.player, this.platforms); //se añaden los colliders entre objetos

        this.physics.add.collider(this.recolectables, this.platforms);

        this.physics.add.collider(this.newobject, this.platforms);

        this.physics.add.overlap(
            this.player,
            this.recolectables,
            (player, recolectable) => {
                this.score += recolectable.getData('value');
                this.scoreText.setText(`Score: ${this.score}`);
                recolectable.disableBody(true, true);
            },
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.newobject,
            (player, circulo) => {
                this.score -= 5;
                this.scoreText.setText(`Score: ${this.score}`);
                circulo.disableBody(true, true);
            },
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

        if (this.score >= 100) {
            this.physics.pause();
            this.victoryText.visible = true;
        }
    }
}