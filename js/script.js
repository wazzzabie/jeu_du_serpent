
document.addEventListener("DOMContentLoaded", function(event) {

    // le jeu
    class Jeu{
        constructor(_idSvg, _idPointage) {
            console.log("Création du Jeu");

            this.s = Snap(_idSvg);

            this.sortiePointage = document.querySelector(_idPointage);

            this.grandeurCarre = 20;
            this.grandeurGrille = 15;
        }

        nouvellePartie(){
            this.finPartie();

            this.affichagePointage(1);

            this.pomme = new Pomme(this);

            this.serpent = new Serpent(this);
        }

        finPartie(){
            if(this.pomme !== undefined){
                this.pomme.supprimePomme();
                this.pomme = undefined;
            }
            if(this.serpent !== undefined){
                this.serpent.supprimeSerpent();
                this.serpent = undefined;
            }
        }

        affichagePointage(_lePointage){
            this.sortiePointage.innerHTML = _lePointage;
        }

    }


    //le serpent
    class Serpent{
        constructor(_leJeu) {
            console.log("Création du Serpent");

            this.leJeu = _leJeu;

            this.currentX = -1;
            this.currentY = 0;

            this.nextMoveX = 1;
            this.nextMoveY = 0;

            this.serpentLongueur = 1;
            this.tblCarreSerpent = [];

            this.touche = false;

            this.vitesse = 250;
            this.timing = setInterval(this.controleSerpent.bind(this), this.vitesse)

            document.addEventListener("keydown", this.verifTouche.bind(this))
        }

        verifTouche(_evt){

            var evt = _evt;
            console.log(evt.keyCode);

            this.deplacement(evt.keyCode);

        }

        deplacement(dirCode){
            switch(dirCode){
                case 37:
                    this.nextMoveX = -1;
                    this.nextMoveY = 0;
                    break;
                case 38:
                    this.nextMoveX = 0;
                    this.nextMoveY = -1;
                    break;
                case 39:
                    this.nextMoveX = 1;
                    this.nextMoveY = 0;
                    break;
                case 40:
                    this.nextMoveX = 0;
                    this.nextMoveY = 1;
                    break;
            }
            //console.log(this.nextMoveX, this.nextMoveY);
        }

        controleSerpent(){
            var nextX= this.currentX + this.nextMoveX;
            var nextY= this.currentY + this.nextMoveY;

            this.tblCarreSerpent.forEach(function(element){
                if(nextX === element[1] && nextY === element[2]){
                    console.log("touche moi-même");
                    this.leJeu.finPartie();
                    this.touche = true;
                }
            }.bind(this));

            if(nextY < 0 || nextX < 0 || nextY > this.leJeu.grandeurGrille-1 || nextX > this.leJeu.grandeurGrille-1){
                console.log("touche limite");
                this.leJeu.finPartie();
                this.touche = true;
            }

            if(!this.touche){
                if(this.currentX === this.leJeu.pomme.pomme[1] && this.currentY ===this.leJeu.pomme.pomme[2]){
                    this.serpentLongueur++;

                    this.leJeu.affichagePointage(this.serpentLongueur);
                    this.leJeu.pomme.supprimePomme();
                    this.leJeu.pomme.ajoutePomme();
                }

                this.dessineCarre(nextX, nextY);
                this.currentX = nextX;
                this.currentY = nextY;
            }
        }

        dessineCarre(x, y){
            var unCarre = [this.leJeu.s.rect(x * this.leJeu.grandeurCarre, y * this.leJeu.grandeurCarre, this.leJeu.grandeurCarre, this.leJeu.grandeurCarre), x, y];

            this.tblCarreSerpent.push(unCarre);

            if(this.tblCarreSerpent.length > this.serpentLongueur){
                this.tblCarreSerpent[0][0].remove();
                this.tblCarreSerpent.shift();
            }

        }

        supprimeSerpent(){
            clearInterval(this.timing);

            while(this.tblCarreSerpent.length > 0){
                this.tblCarreSerpent[0][0].remove();
                this.tblCarreSerpent.shift();
            }
        }
    }

    //la pomme
    class Pomme{
        constructor(_leJeu) {
            console.log("Création de la Pomme");

            this.leJeu = _leJeu;

            this.pomme = [];

            this.ajoutePomme();
        }

        ajoutePomme(){
            var posX = Math.floor(Math.random() * this.leJeu.grandeurGrille);
            var posY = Math.floor(Math.random() * this.leJeu.grandeurGrille);

            this.pomme = [this.leJeu.s.rect(posX * this.leJeu.grandeurCarre, posY * this.leJeu.grandeurCarre, this.leJeu.grandeurCarre, this.leJeu.grandeurCarre).attr({fill: "red"}), posX, posY];
        }

        supprimePomme(){
            this.pomme[0].remove();
        }
    }



    var unePartie = new Jeu("#jeu","#pointage");

    var btnJouer = document.querySelector("#btnJouer");
    btnJouer.addEventListener("click", nouvellePartie);

    function nouvellePartie(){
      unePartie.nouvellePartie();
    }
});