export default class ninja_moncho extends Phaser.Scene {
    constructor() {
        super("ninja_moncho"); // se asigna el nombre de la escena
    }

    init() {
       this.score = 0;
       this.timer = 45;
       // asignar las variables para poder pasarlas entre escenas
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

        this.platforms.create(400, 200, "platform").setScale(0.5).refreshBody();
        this.platforms.create(25, 400, "platform");
        this.platforms.create(775, 400, "platform");

        this.player = this.physics.add.sprite(100, 480, "ninja").setScale(0.12); //se añade el personaje

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys(); // se crean los contorles de movimiento
        this.restartKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.R
        );

        this.gameOver = false; // marca el gameover como false para activarlo despues

        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`,{
            fontSize: "32px",
            fill: "#fff",
        }) // añade el texto de score

        this.gameOverText = this.add.text(400, 300, "Game Over", {
            fontSize: "64px",
            fill: "#fff",
        }).setOrigin(0.5, 0.5);
        this.gameOverText.visible = false; // añade el texto de game over y lo desactiva

        this.timertext = this.add.text(16, 45, `Time: ${this.timer}`, {
            fontSize: "32px",
            fill: "#fff",
        }) // añade el texto del timer

        this.victoryText = this.add.text(400, 300, "Ganaste", {
            fontSize: "64px",
            fill: "#fff",
        }).setOrigin(0.5, 0.5);
        this.victoryText.visible = false; // añade el texto de victoria y lo desactiva

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
        });// activa la funcion para que el timer se ejecute

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
        }); // añade el evento para que se generen las figuras aleatoriamente cada 0.5s

        this.newobject = this.physics.add.group(); // crea un nuevo grupo de fisicas

        this.spawnnewobject = this.time.addEvent({
            delay: 500,
            callback: () => {
                const circle = [this.circulo];

                const shapeCircle = this.newobject.create(Phaser.Math.Between(32, 800), 0, Phaser.Math.RND.pick(circle))
                const scaleCircle = Phaser.Math.FloatBetween(0.1, 0.1);
                shapeCircle.setScale(scaleCircle);
                shapeCircle.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            },
            loop: true
        }); // añade el evento para que se generen los circulos aleatoriamente cada 0.5s, colocado aparte para manejar la escala de la imagen

        this.physics.add.collider(this.player, this.platforms); //se añaden los colliders entre player y plataformas

        this.physics.add.collider(this.recolectables, this.platforms, (recolectable) => {
            const valoractual = recolectable.getData('value');
            const restapuntos = valoractual - 5;

            if (restapuntos <= 0) {
                recolectable.disableBody(true, true);
            } else {
                recolectable.setData('value', restapuntos);
            }
        }); // hace que cuando las figuras colisionen con las plataformas se les reste 5 puntos y si llegan a 0 desaparezcan

        this.physics.add.collider(this.newobject, this.platforms, (newobject) => {
            const valoractualCircle = newobject.getData('value') || 0;
            const sumapuntosCircle = valoractualCircle + 5;

            if (sumapuntosCircle >= 0) {
                newobject.disableBody(true, true);
            } else {
                newobject.setData('value', sumapuntosCircle);
            }
        }); // hace que cuando los circulos colisionen con las plataformas se les sume 5 puntos y si llegan a 0 desaparezcan

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
        ); // hace que el jugador pueda recoger las figuras y se le sumen los puntos

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
        ); // hace que el jugador pueda recoger los circulos y se le resten los puntos

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
            this.player.setVelocityY(-300);

        }

        if (this.score >= 100) {
            this.physics.pause();
            this.victoryText.visible = true;
        } // condicion de victoria
    }
}