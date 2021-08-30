import Phaser from './lib/phaser.js';

const BLOCK_HEIGHT = 25;
const BLOCK_WIDTH = 25;
const SCENE_HEIGHT = 500;
const SCENE_WIDTH = 300;

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

    this.pieceType = [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
    ];

    this.player = {
        pos: { x: 0, y:0 },
        piece: this.pieceType,
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
                console.log(col)
                if (col !== 0) {
                    activePiece.push(
                        this.add.rectangle(
                            (x + offset.x) * BLOCK_WIDTH + BLOCK_WIDTH / 2,
                            (y + offset.y) * BLOCK_HEIGHT + BLOCK_HEIGHT / 2,
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
        player.pos.y--
        this.join(player, field);
        player.pos.y = -1;
        return this.drawPiece(player.piece, player.pos);
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

    this.rotate = () => {
        const piece = this.player.piece;
        this.rotateMatrix(3, piece);
        this.activePiece.forEach(block => {
            block.destroy();
        });
        this.activePiece = this.drawPiece(this.player.piece, this.player.pos);
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
            this.rotate();
        });
    };
}

function preload() {}

function create() {
    this.activePiece = this.drawPiece(this.player.piece, this.player.pos);
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
