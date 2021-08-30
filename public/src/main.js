import Phaser from './lib/phaser.js';

const BLOCK_HEIGHT = 30;
const BLOCK_WIDTH = 30;
const SCENE_HEIGHT = 600;
const SCENE_WIDTH = 360;

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'tetris-player1',
    width: SCENE_WIDTH,
    height: SCENE_HEIGHT,
    scene: {
        init: init,
        preload: preload,
        create: create,
        update: update,
    },
});

function init() {
    this.dcount = 0;

    this.allPiece = [
        {
            type: 'S',
            color: 0xFF0000,
            shaped: [
                [0, 0, 0],
                [0, 1, 1],
                [1, 1, 0],
            ],
        },
        {
            type: 'Z',
            color: 0xFFFF00,
            shaped: [
                [0, 0, 0],
                [2, 2, 0],
                [0, 2, 2],
            ],
        },
        {
            type: 'L',
            color: 0xFF00FF,


            shaped: [
                [0, 3, 0],
                [0, 3, 0],
                [0, 3, 3],
            ],
        },
        {
            type: 'J',
            color: 0x00FF00,
            shaped: [
                [0, 4, 0],
                [0, 4, 0],
                [4, 4, 0],
            ],
        },
        {
            type: 'T',
            color: 0x0000FF,
            shaped: [
                [0, 0, 0],
                [0, 5, 0],
                [5, 5, 5],
            ],
        },
        {
            type: 'O',
            color: 0x00FFFF,
            shaped: [
                [6, 6],
                [6, 6],
            ],
        },
        {
            type: 'I',
            color: 0xFFFFFF,
            shaped: [
                [0, 0, 7, 0],
                [0, 0, 7, 0],
                [0, 0, 7, 0],
                [0, 0, 7, 0],
            ],
        },
    ];

    this.player = {
        pos: { x: 5, y: -1 },
        piece: this.allPiece[6].shaped,
        pieceType: this.allPiece[6].type,
        color: this.allPiece[6].color
    };

    this.field = (() => {
        let w = parseInt(SCENE_WIDTH / BLOCK_WIDTH);
        let h = parseInt(SCENE_HEIGHT / BLOCK_HEIGHT);
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    })();

    this.drawPiece = (player) => {
        const activePiece = [];
        player.piece.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col !== 0) {
                    activePiece.push(
                        this.add.rectangle(
                            (x + player.pos.x) * BLOCK_WIDTH + BLOCK_WIDTH / 2,
                            (y + player.pos.y) * BLOCK_HEIGHT + BLOCK_HEIGHT / 2,
                            BLOCK_WIDTH,
                            BLOCK_HEIGHT,
                            player.color,
                        ),
                    );
                }
            });
        });
        return activePiece;
    };

    this.drawNewPiece = (player) => {
        const random = Math.floor(Math.random() * 7)
        player.piece = this.allPiece[random].shaped
        player.pieceType = this.allPiece[random].type
        player.color = this.allPiece[random].color
        return this.drawPiece(player);
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
        const b = player.piece;
        const o = player.pos;
        for (let y = 0; y < b.length; y++) {
            for (let x = 0; x < b[y].length; x++) {
                if (b[y][x] !== 0 && (field[y + o.y] && field[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    };

    this.join = (player, field) => {
        player.piece.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    field[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    };

    this.move = (Piece, { x, y }) => {
        Piece.forEach(block => {
            block.x += BLOCK_WIDTH * x;
            block.y += BLOCK_HEIGHT * y;
        });
    };

    this.collisionBottomHandle = (player, field) => {
        player.pos.y--;
        this.join(player, field);
        player.pos.y = 0;
        return this.drawNewPiece(player);
    };

    this.rotateMatrix = (N, mat) => {
        for (let x = 0; x < N / 2; x++) {
            for (let y = x; y < N - x - 1; y++) {
                let temp = mat[x][y];
                mat[x][y] = mat[y][N - 1 - x];
                mat[y][N - 1 - x] = mat[N - 1 - x][N - 1 - y];
                mat[N - 1 - x][N - 1 - y] = mat[N - 1 - y][x];
                mat[N - 1 - y][x] = temp;
            }
        }
    };

    this.rotateCollision = (player, field) => {};

    this.rotate = (player, field, activePiece) => {
        this.rotateMatrix(player.piece.length, player.piece);
        if (this.collision(player, field)) {
            player.pieceType == 'I'
                ? player.pos.x < 3
                    ? (this.player.pos.x += 2)
                    : (this.player.pos.x -= 2)
                : player.pos.x < 3
                ? (this.player.pos.x += 1)
                : (this.player.pos.x -= 1);
        }
        activePiece.forEach(block => {
            block.destroy();
        });
        return (activePiece = this.drawPiece(player));
    };

    this.initInput = () => {
        this.input.keyboard.on('keydown-LEFT', event => {
            this.player.pos.x += -1;
            this.collision(this.player, this.field)
                ? (this.player.pos.x += 1)
                : this.move(this.activePiece, { x: -1, y: 0 });
        });

        this.input.keyboard.on('keydown-RIGHT', event => {
            this.player.pos.x += 1;
            this.collision(this.player, this.field)
                ? (this.player.pos.x += -1)
                : this.move(this.activePiece, { x: 1, y: 0 });
        });

        this.input.keyboard.on('keydown-DOWN', event => {
            this.player.pos.y++;
            this.collision(this.player, this.field)
                ? (this.activePiece = this.collisionBottomHandle(this.player, this.field))
                : this.move(this.activePiece, { x: 0, y: 1 });
        });

        this.input.keyboard.on('keydown-UP', event => {
            this.activePiece = this.rotate(this.player, this.field, this.activePiece);
        });
    };
}

function preload() {}

function create() {
    this.activePiece = this.drawPiece(this.player);
    this.drawField(this.field);
    this.initInput();
}

function update(time, deltaTime) {
    if (this.dcount > 500) {
        window.FIELD = this.field;
        this.player.pos.y++;
        this.collision(this.player, this.field)
            ? (this.activePiece = this.collisionBottomHandle(this.player, this.field))
            : this.move(this.activePiece, { x: 0, y: 1 });
        this.dcount = 0;
    }
    this.dcount += deltaTime;
}
