export default class perdiojuego extends Phaser.Scene {
    constructor() {
        super("perdiojuego");
    }

    init(data) {
        this.score = data.score || 0;
        this.timer = data.timer || 0;
        this.state = data.state || "";
    }

    preload() {}

    create() {
        this.add.text(400, 300, "Perdiste", {
            fontSize: "64px",
            fill: "#fff",
        }).setOrigin(0.5, 0.5);

        this.add.text(400, 400, `Puntaje: ${this.score}`, {
            fontSize: "32px",
            fill: "#fff",
        }).setOrigin(0.5, 0.5);

        this.add.text(400, 450, `Tiempo: ${this.timer}`, {
            fontSize: "32px",
            fill: "#fff",
        }).setOrigin(0.5, 0.5);

        this.restartKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.R
        );
    }

    update() {
        if (this.restartKey.isDown) {
            this.scene.start("ninja_moncho")
        }
    }
}