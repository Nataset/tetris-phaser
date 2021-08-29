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

const BLOCK_HEIGHT = 50;
const BLOCK_WIDTH = 50;
const SCENE_HEIGHT = 1000;
const SCENE_WIDTH = 600;

function init() {
    this.dcount = 0;

    this.pieceType = [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
    ];

    this.player = {
        pos: { x: 5, y: 15 },
        pieceType: this.pieceType,
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

    this.drawPiece = (piece, offset) => {
        const activePiece = [];
        piece.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col !== 0) {
                    activePiece.push(
                        this.add.rectangle(
                            (x - 1 + offset.x) * BLOCK_WIDTH + BLOCK_WIDTH / 2,
                            (y - 1 + offset.y) * BLOCK_HEIGHT + BLOCK_HEIGHT / 2,
                            BLOCK_WIDTH,
                            BLOCK_HEIGHT,
                            0xffffff,
                        ),
                    );
                }
            });
        });
        return activePiece;
    };

    this.drawField = field => {
        field.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col != 0) {
                    this.add.rectangle(
                        x * BLOCK_WIDTH + BLOCK_HEIGHT / 2,
                        y * BLOCK_HEIGHT + BLOCK_HEIGHT / 2,
                        BLOCK_WIDTH,
                        BLOCK_HEIGHT,
                        0xffffff,
                    );
                }
            });
        });
    };

    this.collision = (player, field) => {
        const piece = player.pieceType;
        const pos = player.pos;
        let checkFlag = false;
        piece.forEach((row, y) => {
            piece.forEach((col, x) => {
                if (!field[y + pos.y]) {
                    checkFlag = true;
                }
                else if (piece[y][x] !== 0 && field[y + pos.y][x + pos.x] !== 0) {
                    checkFlag = true;
                }
            });
        });
        return checkFlag ? true : false;
    };

    this.join = (player, field) => {
        player.pieceType.forEach((row, y) => {
            row.forEach((value, x) => {
                if(value !== 0){
                    field[y - 1 + player.pos.y][x - 1 + player.pos.x] = value;
                    console.table(field)
                }
            })
        })
    }
}

function preload() {}

function create() {
    this.activePiece = this.drawPiece(this.player.pieceType, this.player.pos);
    this.drawField(this.field);
}

function update(time, deltaTime) {
    if (this.dcount > 1000) {
        if (!this.collision(this.player, this.field)) {
            this.player.pos.y++;
            this.activePiece.forEach(block => {
                block.y += 50;
            });
        } else {
            this.join(this.player, this.field);
            this.player.pos.y = 0;
            this.activePiece = this.drawPiece(this.player.pieceType, this.player.pos);
        }
        this.dcount = 0;
    }
    this.dcount += deltaTime;
}
