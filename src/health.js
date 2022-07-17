class Health {
    constructor() {
        this.health = 0
    }

    reduceHealth(amount) {
        this.health = this.health- amount;
        this.updateProgressBar()
        this.health < 0 && game.end();
    }

    restore() {
        this.health = 100;
        this.updateProgressBar();
    }

    updateProgressBar() {
        $("#idHealth").removeClass("bg-danger bg-warning bg-success").addClass(() => {
            if(this.health < 20) {
                return "bg-danger";                        
            } else if (this.health < 40) {
                return "bg-warning";                        
            } else {
                return "bg-success";
            }
        });
        $("#idHealth").width(this.health+"%");
    }
}


window.readyCount ? (window.readyCount++) : (window.readyCount = 1)