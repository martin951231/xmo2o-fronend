class SCAN {
    constructor(vm, timeout = 100) {
        this.barCode = "";
        this.vm = vm;
        this.lastTime = 0;
        this.timeout = timeout;
        this.timer = null;
        this.event = this.eventListenerScanCode.bind(this);
    }

    //监听扫码枪
    eventListenerScanCode(e) {
        e = e || window.event;
        let currCode = e.keyCode || e.which || e.charCode;

        let currTime = new Date().getTime();
        if (this.lastTime > 0) {
            if (currTime - this.lastTime <= this.timeout) {
                // 扫码枪有效输入间隔毫秒
                this.barCode += String.fromCharCode(currCode);
            } else if (currTime - this.lastTime > this.timeout) {
                // 超过间隔时间，认为不是扫码枪输入内容，清空
                this.ClearBarCode();
            }
        } else {
            // 第一次按键
            this.barCode = String.fromCharCode(currCode);
        }
        // console.log(currTime, "监听扫监听到的值：", this.barCode);
        this.lastTime = currTime;

        if (currCode == 13) {
            if (this.barCode) {
                // console.log("扫码结果：" + this.barCode);

                let code = this.barCode.substring(0, this.barCode.length - 1);
                if (!code) return;

                this.vm && this.vm.$bus.$emit("scanCode", code);
            }
            this.ClearBarCode();
        }

        // 在没有按enter的情况下，定时清空
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        this.timer = setTimeout(() => {
            if (this.lastTime) {
                this.ClearBarCode();
                console.log("执行清空");
            }
            clearTimeout(this.timer);
            this.timer = null;
        }, this.timeout);
    }

    ClearBarCode() {
        this.barCode = "";
        this.lastTime = 0;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    start() {
        window.addEventListener("keypress", this.event);
    }

    stop() {
        window.removeEventListener("keypress", this.event);
        this.ClearBarCode();
    }
}
export default SCAN;
