import Phaser from './lib/phaser.js';

const BLOCK_HEIGHT = 25;
const BLOCK_WIDTH = 25;
const SCENE_HEIGHT = 500;
const SCENE_WIDTH = 300;

const game1 = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'tetris-player1',
    width: SCENE_WIDTH,
    height: SCENE_HEIGHT,
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
    this.dcount = 0;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.pieceType = [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
    ];

    this.player = {
        pos: { x: 5, y: 0 },
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
                console.log(y, x)
                // if (!field[y + pos.y]) {
                //     checkFlag = true;
                // } 
                if (piece[y][x] !== 0 && (field[y + pos.y] && field[y + pos.y][x + pos.x]) !== 0) {
                    checkFlag = true;
                }
            });
        });
        return checkFlag ? true : false;
    };

    this.join = (player, field) => {
        player.pieceType.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    field[y + player.pos.y - 1][x + player.pos.x - 1] = value;
                }
            });
        });
    };
}

function preload() {}

function create() {
    this.activePiece = this.drawPiece(this.player.pieceType, this.player.pos);
    this.drawField(this.field);
}

function update(time, deltaTime) {
    if (this.dcount > 500) {
        if (!this.collision(this.player, this.field)) {
            this.player.pos.y++;
            this.activePiece.forEach(block => {
                block.y += BLOCK_HEIGHT;
            });
        } else {
            this.join(this.player, this.field);
            this.player.pos.y = 0;
            this.activePiece = this.drawPiece(this.player.pieceType, this.player.pos);
        }

        if (this.dcount > 10) {
            if (this.cursors.left.isDown) {
                if (!this.collision(this.player, this.field)) {
                    console.log(this.player.pos.x);
                    this.player.pos.x--;
                    this.activePiece.forEach(block => {
                        block.x -= BLOCK_WIDTH;
                    });
                }
            } else if (this.cursors.right.isDown) {
                if (!this.collision(this.player, this.field)) {
                    console.log(this.player.pos.x);
                    this.player.pos.x++;
                    this.activePiece.forEach(block => {
                        block.x += BLOCK_WIDTH;
                    });
                }
            }
        }

        this.dcount = 0;
    }
    this.dcount += deltaTime;
}
