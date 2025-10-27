let objs = [];
let colors = ['#cdb4db', '#ffafcc', '#a2d2ff', '#edede9'];
let menu; // 宣告 Menu 物件

function setup() {
    // 全螢幕設定
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    objs.push(new DynamicShape());
    
    // 設定中央文字的字體大小
    textSize(width * 0.04); // 中央文字放大為 4%
    textAlign(CENTER, CENTER); 
    
    // 初始化 Menu 物件
    menu = new Menu(0.08); // 傳入選單寬度比例 (8%)
}

// 處理視窗大小改變，確保全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // 調整中央文字的字體大小以適應新的畫布尺寸
  textSize(width * 0.04);
  
  // 更新選單大小
  menu.resize(0.08);
}

function draw() {
    background('#fefae0');
    
    // 檢查滑鼠是否在畫布的左半邊
    if (mouseX < width / 2) {
        menu.show = true;
    } else {
        menu.show = false;
    }

    // 運行動畫物件 (這一部分獨立於選單狀態，確保動畫連續)
    for (let i of objs) {
        i.run();
    }

    if (frameCount % int(random([15, 30])) == 0) {
        let addNum = int(random(1, 30));
        for (let i = 0; i < addNum; i++) {
            objs.push(new DynamicShape());
        }
    }
    for (let i = 0; i < objs.length; i++) {
        if (objs[i].isDead) {
            objs.splice(i, 1);
        }
    }
    
    // 繪製螢幕中間的字幕，固定在 width / 2 (絕對中央)
    fill('#52796f'); 
    text("您好我是教科一B 119180洪千涵", width / 2, height / 2);

    // 繪製選單 (必須在最後繪製，才會在最上層)
    menu.run();
}

// --- UPDATED FUNCTION: 處理滑鼠點擊 (符合新的 4 個選項) ---
function mousePressed() {
    // 只有當選單可見時才檢查點擊
    if (menu.show) {
        
        if (menu.isHovering(1)) {
            // 選項 1: 第一單元作品 -> 顯示 http://127.0.0.1:5500/index.html
            window.open("http://127.0.0.1:5500/index.html", '_blank');
        } else if (menu.isHovering(2)) {
            // 選項 2: 第一單元講義
            window.open("https://hackmd.io/@UGU0h5ZNRIeUfO-h9Y3q1Q/rkMFw7Ailx", '_blank');
        } else if (menu.isHovering(3)) {
            // 選項 3: 測驗系統 (目前沒有連結，僅關閉選單)
            menu.show = false;
        } else if (menu.isHovering(4)) {
            // 選項 4: 回到首頁 (目前沒有連結，僅關閉選單)
            menu.show = false;
        }
    }
}
// --- END UPDATED FUNCTION ---


function easeInOutExpo(x) {
    return x === 0 ? 0 :
        x === 1 ?
        1 :
        x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 :
        (2 - Math.pow(2, -20 * x + 10)) / 2;
}

class DynamicShape {
    constructor() {
        // 確保初始位置不在中央區域
        const centerMargin = 0.3; // 30% 邊緣區
        const availableRangesX = [
            { min: 0, max: centerMargin },            // 左側 0% - 30%
            { min: 1 - centerMargin, max: 1 }         // 右側 70% - 100%
        ];
        const availableRangesY = [
            { min: 0, max: centerMargin },            // 上側 0% - 30%
            { min: 1 - centerMargin, max: 1 }         // 下側 70% - 100%
        ];

        let rangeX = random(availableRangesX);
        let rangeY = random(availableRangesY);

        this.x = random(rangeX.min, rangeX.max) * width;
        this.y = random(rangeY.min, rangeY.max) * height;

        
        this.reductionRatio = 1;
        this.shapeType = int(random(4));
        this.animationType = 0;
        this.maxActionPoints = int(random(2, 5));
        this.actionPoints = this.maxActionPoints;
        this.elapsedT = 0;
        this.size = 0;
        this.sizeMax = (width + height) / 2 * random(0.01, 0.035); 
        this.fromSize = 0;
        this.init();
        this.isDead = false;
        this.clr = random(colors);
        this.changeShape = true;
        this.ang = int(random(2)) * PI * 0.25;
        this.lineSW = 0;

        this.isCircle = this.shapeType < 2; 
        if (this.isCircle) {
            this.floatAngle = random(TWO_PI); 
            this.floatSpeed = this.sizeMax * random(0.01, 0.05); 
            this.driftOffsetX = random(1000); 
            this.driftOffsetY = random(1000); 
        }
    }

    show() {
        push();
        translate(this.x, this.y);
        if (this.animationType == 1) scale(1, this.reductionRatio);
        if (this.animationType == 2) scale(this.reductionRatio, 1);
        fill(this.clr);
        stroke(this.clr);
        strokeWeight(this.size * 0.05);
        
        if (this.shapeType == 0) {
            noStroke();
            circle(0, 0, this.size);
        } else if (this.shapeType == 1) {
            noFill();
            circle(0, 0, this.size);
        } 
        else if (this.shapeType == 2) {
            noStroke();
            rect(0, 0, this.size, this.size);
        } else if (this.shapeType == 3) {
            noFill();
            rect(0, 0, this.size * 0.9, this.size * 0.9);
        } else if (this.shapeType == 4) {
            line(0, -this.size * 0.45, 0, this.size * 0.45);
            line(-this.size * 0.45, 0, this.size * 0.45, 0);
        }
        pop();
        strokeWeight(this.lineSW);
        stroke(this.clr);
        line(this.x, this.y, this.fromX, this.fromY);
    }

    move() {
        if (this.isCircle) {
            this.x += cos(this.floatAngle) * this.floatSpeed * noise(this.driftOffsetX) * 0.5;
            this.y += sin(this.floatAngle) * this.floatSpeed * noise(this.driftOffsetY) * 0.5;
            
            this.floatAngle += map(noise(this.driftOffsetX + frameCount * 0.005), 0, 1, -0.1, 0.1);

            this.size = this.sizeMax * (0.8 + 0.2 * sin(frameCount * 0.05));

            this.driftOffsetX += 0.001;
            this.driftOffsetY += 0.001;

            if (this.x < -this.sizeMax || this.x > width + this.sizeMax || 
                this.y < -this.sizeMax || this.y > height + this.sizeMax) {
                this.isDead = true; 
            }
            
            this.elapsedT++;
            if (this.elapsedT > this.duration * 4) {
                this.isDead = true;
            }
            return; 
        }

        let n = easeInOutExpo(norm(this.elapsedT, 0, this.duration));
        if (0 < this.elapsedT && this.elapsedT < this.duration) {
            if (this.actionPoints == this.maxActionPoints) {
                this.size = lerp(0, this.sizeMax, n);
            } else if (this.actionPoints > 0) {
                if (this.animationType == 0) {
                    this.size = lerp(this.fromSize, this.toSize, n);
                } 
                else if (this.animationType == 1) {
                    this.x = lerp(this.fromX, this.toX, n);
                    this.lineSW = lerp(0, this.size / 5, sin(n * PI));
                } else if (this.animationType == 2) {
                    this.y = lerp(this.fromY, this.toY, n);
                    this.lineSW = lerp(0, this.size / 5, sin(n * PI));
                } 
                else if (this.animationType == 3) {
                    if (this.changeShape == true) {
                        this.shapeType = int(random(5));
                        this.changeShape = false;
                    }
                }
                this.reductionRatio = lerp(1, 0.3, sin(n * PI));
            } else {
                this.size = lerp(this.fromSize, 0, n);
            }
        }

        this.elapsedT++;
        if (this.elapsedT > this.duration) {
            this.actionPoints--;
            this.init();
        }
        if (this.actionPoints < 0) {
            this.isDead = true;
        }
    }

    run() {
        this.show();
        this.move();
    }

    init() {
        this.elapsedT = 0;
        this.fromSize = this.size;
        this.toSize = this.sizeMax * random(0.5, 1.5);
        this.fromX = this.x;
        this.toX = this.fromX + (width / 10) * random([-1, 1]) * int(random(1, 4));
        this.fromY = this.y;
        this.toY = this.fromY + (height / 10) * random([-1, 1]) * int(random(1, 4));
        this.animationType = int(random(3));
        
        if (this.isCircle) {
            this.duration = random(50, 100); 
        } else {
            this.duration = random(60, 100); 
        }
    }
}

// --- MODIFIED CLASS: Menu ---
class Menu {
    constructor(widthRatio) {
        this.show = false; 
        this.w = width * widthRatio; // 選單寬度 (8% 畫布寬度)
        this.h = height * 0.9; // 選單高度 (90% 畫布高度)
        this.padding = 10; 
        this.targetX = 0; // 顯示時的 X 座標 (緊貼左邊緣)
        this.hiddenX = -this.w; // 隱藏時的 X 座標
        this.currentX = this.hiddenX; 
        this.y = height * 0.05; // 讓選單垂直置中 (100% - 90%) / 2 = 5%
        this.easing = 0.1; 
    }
    
    // 處理視窗大小改變
    resize(widthRatio) {
        this.w = width * widthRatio;
        this.h = height * 0.9;
        this.hiddenX = -this.w;
        this.y = height * 0.05;
        // 如果選單是收起來的，需更新收起來的位置
        if (!this.show) {
            this.currentX = this.hiddenX;
        }
    }

    // 檢查滑鼠是否懸停在指定的選項上 (itemIndex: 1, 2, 3, or 4)
    isHovering(itemIndex) {
        if (!this.show || this.currentX < this.hiddenX + 1) return false; 

        let startX = this.currentX;
        let endX = this.currentX + this.w;
        
        let lineHeight = this.h / (Menu.getLabels().length + 2);
        
        // 1 for 第一單元作品, 2 for 第一單元講義, 3 for 測驗系統, 4 for 回到首頁
        let startY = this.y + this.padding * 4 + (itemIndex - 1) * lineHeight;
        let endY = startY + lineHeight;
        
        // 調整結束位置，讓點擊區域略大於文字（更使用者友善）
        if (itemIndex === Menu.getLabels().length) {
            endY = this.y + this.h - this.padding * 2; 
        }
        
        return mouseX > startX && mouseX < endX && mouseY > startY && mouseY < endY;
    }
    
    // 靜態方法來獲取選單標籤 (避免重複定義)
    static getLabels() {
        return ["第一單元作品", "第一單元講義", "測驗系統", "回到首頁"];
    }

    run() {
        let desiredX = this.show ? this.targetX : this.hiddenX;
        
        // FIX: 修正 lerp 卡住問題
        if (abs(this.currentX - desiredX) < 0.1) { 
            this.currentX = desiredX;
        } else {
            this.currentX = lerp(this.currentX, desiredX, this.easing);
        }

        this.drawBackground();
        // 只有當選單展開時才繪製選項 
        if (this.currentX > this.hiddenX + 1) { 
            this.drawItems();
        }
    }

    drawBackground() {
        push();
        // 選單顏色為 f9f7f3，半透明 (alpha 設為 200/255)
        fill(249, 247, 243, 200); 
        noStroke();
        
        // 繪製選單背景矩形
        rectMode(CORNER); 
        rect(this.currentX, this.y, this.w, this.h, 5); // 圓角 5

        pop();
    }

    drawItems() {
        push();
        let labels = Menu.getLabels();

        // 始終使用原始顏色 (深灰色)，符合要求「滑鼠移到選單後字體不用改顏色」
        fill(50);
        textAlign(CENTER, TOP);

        // 可用寬度（左右保留 padding）
        let maxTextWidth = this.w - this.padding * 2;

        // 從一個合理的字體大小開始，逐步減小直到所有文字都能放入 maxTextWidth 或達到最小字體
        let ts = int(this.w * 0.12); // 初始字體大小
        let minTs = 8;
        let fits = false;
        while (!fits && ts >= minTs) {
            textSize(ts);
            fits = true;
            for (let t of labels) {
                if (textWidth(t) > maxTextWidth) {
                    fits = false;
                    break;
                }
            }
            if (!fits) ts--;
        }
        textSize(max(ts, minTs));

        // 置中繪製，並計算垂直間距
        let startX = this.currentX + this.w / 2;
        let startY = this.y + this.padding * 4;
        let lineHeight = this.h / (labels.length + 2); // 4個選項 + 2個額外間距

        for (let i = 0; i < labels.length; i++) {
            // 由於沒有懸停效果，直接繪製文字
            text(labels[i], startX, startY + i * lineHeight);
        }
        pop();
    }
}
// --- END MODIFIED CLASS ---