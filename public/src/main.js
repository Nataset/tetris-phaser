import Phaser from './lib/phaser.js';

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 600,
    height: 1000,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
        },
    },
    scene: {
        init: init,
        preload: preload,
        create: create,
        update: update,
    },
});

function init() {
    this.piece = [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
    ];

    this.player = {
        pos: { x: 5, y: 0 },
        piece: this.piece,
    };

    this.field = (() => {
        let w = 12;
        let h = 20;
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    })();

    this.drawPiece = () => {};
    this.dcount = 0;
}

function preload() {}

function create() {
    this.playerPiece = [];
    this.piece.forEach((row, y) => {
        row.forEach((col, x) => {
            if (col !== 0) {
                this.playerPiece.push(
                    this.add.rectangle(
                        50 * (x - 1 + this.player.pos.x) + 25,
                        50 * (y - 1 + this.player.pos.y) + 25,
                        50,
                        50,
                        0xffffff,
                    ),
                );
            }
        });
    });
}

function update(time, deltaTime) {
    if (this.dcount > 1000) {
        this.playerPiece.forEach(block => {
            block.y += 50;
        });
        this.dcount = 0;
    }
    this.dcount += deltaTime;
}
